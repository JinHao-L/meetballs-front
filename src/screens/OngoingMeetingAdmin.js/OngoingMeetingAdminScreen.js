import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getFormattedDateTime } from "../../common/CommonFunctions";
import AgendaList from "./AgendaList";
import { blankMeeting } from "../../common/ObjectTemplates";
import { testMeeting } from "../../common/TestData";

var position = -1;

export default function OngoingMeetingAdminScreen() {
	const [meeting, setMeeting] = useState(blankMeeting);
	const [currentTab, setCurrentTab] = useState("participants");
	const [time, setTime] = useState(new Date().getTime());
	const { id } = useParams();

	useEffect(() => {
		getMeeting();
		setInterval(() => {
			setTime(new Date().getTime());
		}, 1000);
	}, []);

	function getMeeting() {
		const pulledMeeting = testMeeting;
		pulledMeeting.participant_lists.sort((p1, p2) => {
			return (" " + p1.user_name).localeCompare(p2.user_name);
		});
		pulledMeeting.agenda_items.sort((p1, p2) => {
			return p1.position - p2.position;
		});
		setMeeting(pulledMeeting);
		getPosition(pulledMeeting);
	}

	function Content() {
		if (currentTab === "participants") {
			return <></>;
		} else {
			return (
				<AgendaList
					time={time}
					agenda={meeting.agenda_items}
					position={position}
				/>
			);
		}
	}

	updateDelay(meeting.agenda_items, time);

	return (
		<>
			<Container className="Container__padding--vertical">
				<Row>
					<Col
						lg={3}
						md={12}
						sm={12}
						className="Container__padding--horizontal"
					>
						<p className="Text__header">{meeting.name}</p>
						<p className="Text__subheader">
							{getFormattedDateTime(meeting.start_time)}
						</p>
						<div className="d-grid gap-2">
							<Button variant="outline-secondary">
								Reopen Zoom
							</Button>
						</div>
						<div className="Buffer--20px" />
						<div className="Line--horizontal" />
						<div className="Buffer--20px" />
						<p>
							{position < meeting.agenda_items.length
								? "Estimated End Time:"
								: "Time Ended:"}
						</p>
						<p className="Text__header">
							{getEndTime(time, meeting.agenda_items)}
						</p>
						<div className="d-grid gap-2">
							<AgendaToggle
								agenda={meeting.agenda_items}
								time={time}
							/>
						</div>
						<div className="Buffer--20px" />
					</Col>
					<Col lg={1} md={12} sm={12} />
					<Col
						lg={8}
						md={12}
						sm={12}
						className="Container__padding--horizontal"
					>
						<Nav
							variant="tabs"
							defaultActiveKey="participants"
							onSelect={(selectedKey) =>
								setCurrentTab(selectedKey)
							}
						>
							<Nav.Item>
								<Nav.Link eventKey="participants">
									Participants
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="agenda">Agenda</Nav.Link>
							</Nav.Item>
						</Nav>
						<div className="Buffer--20px" />
						<Content />
						<div className="Buffer--100px" />
					</Col>
				</Row>
			</Container>
		</>
	);
}

// Agenda

function AgendaToggle({ time, agenda }) {
	if (position < 0) {
		return (
			<Button onClick={() => startMeeting(time, agenda)}>
				Start Meeting
			</Button>
		);
	} else if (position < agenda.length) {
		return (
			<Button onClick={() => nextItem(time, agenda)}>Next Item</Button>
		);
	} else {
		return <Button disabled>Meeting Ended</Button>;
	}
}

function startMeeting(time, agenda) {
	position++;
	initializeAgenda(time, agenda);
	uploadChanges();
}

function initializeAgenda(time, agenda) {
	var lastTiming = time;
	for (let i = 0; i < agenda.length; i++) {
		agenda[i].actual_duration = agenda[i].expected_duration;
		agenda[i].start_time = lastTiming;
		lastTiming += agenda[i].actual_duration;
	}
}

function nextItem(time, agenda) {
	if (position >= agenda.length) {
		uploadChanges();
		return;
	}
	agenda[position].actual_duration = time - agenda[position].start_time;
	position++;
	if (position < agenda.length) {
		agenda[position].start_time = time;
	}
	uploadChanges();
}

function updateDelay(agenda, time) {
	if (position < 0 || position >= agenda.length) return;
	const delay = Math.max(
		0,
		time - agenda[position].start_time - agenda[position].actual_duration
	);
	agenda[position].actual_duration += delay;
	updateAgenda(agenda);
}

function updateAgenda(agenda) {
	for (let i = 0; i < agenda.length; i++) {
		agenda[i].isCurrent = i === position;
	}
	if (position >= agenda.length) return;
	var lastTiming = agenda[position].start_time;
	for (let i = position; i < agenda.length; i++) {
		agenda[i].start_time = lastTiming;
		lastTiming += agenda[i].actual_duration;
	}
}

function getPosition(meeting) {
	const agenda = meeting.agenda_items;
	for (let i = 0; i < agenda.length; i++) {
		if (agenda[i].isCurrent) {
			position = i;
			return;
		}
	}
}

function getEndTime(time, agenda) {
	if (position < 0) {
		var duration = 0;
		agenda.forEach((item) => {
			duration += item.expected_duration;
		});
		return new Date(time + duration).toLocaleTimeString();
	} else {
		var lastAgendaItem = agenda[agenda.length - 1];
		return new Date(
			lastAgendaItem.start_time + lastAgendaItem.actual_duration
		).toLocaleTimeString();
	}
}

function uploadChanges() {
	console.log("Uploading");
}
