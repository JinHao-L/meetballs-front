import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {
	getFormattedDateTime,
	getFormattedTime
} from "../../common/CommonFunctions";
import { accessTokenKey, apiUrl } from "../../common/CommonValues";
import AgendaList from "./AgendaList";
import { blankMeeting } from "../../common/ObjectTemplates";
import ParticipantList from "./ParticipantList";

var position = -1;

export default function OngoingMeetingAdminScreen() {
	const [meeting, setMeeting] = useState(blankMeeting);
	const [currentTab, setCurrentTab] = useState("agenda");
	const [time, setTime] = useState(new Date().getTime());
	const { id } = useParams();

	useEffect(() => {
		pullMeeting();
		setInterval(() => {
			setTime(new Date().getTime());
		}, 1000);
	}, []);

	function startZoom() {
		window.open(meeting.startUrl, "_blank");
	}

	async function pullMeeting() {
		const url = apiUrl + "/meeting/" + id;
		const response = await fetch(url, {
			method: "GET",
		});
		if (response.ok) {
			const resultText = await response.text();
			const meetingObj = JSON.parse(resultText, dateTimeReviver);
			meetingObj.participants.sort((p1, p2) => {
				return (" " + p1.userName).localeCompare(p2.userName);
			});
			meetingObj.agendaItems.sort((p1, p2) => {
				return p1.position - p2.position;
			});
			syncMeeting(meetingObj, time);
			setMeeting(meetingObj);
		} else {
			// invalid meeting id
			// TODO: route to dashboard
		}
	}

	function Content() {
		if (currentTab === "agenda") {
			return (
				<AgendaList
					time={time}
					agenda={meeting.agendaItems}
					position={position}
				/>
			);
		} else {
			return (
				<ParticipantList
					meeting={meeting}
					setMeeting={setMeeting}
					position={position}
				/>
			);
		}
	}

	updateDelay(meeting.agendaItems, time);

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
							{getFormattedDateTime(meeting.startedAt)}
						</p>
						<div className="d-grid gap-2">
							<Button
								variant="outline-secondary"
								onClick={startZoom}
							>
								Relaunch Zoom
							</Button>
						</div>
						<div className="Buffer--20px" />
						<div className="Line--horizontal" />
						<div className="Buffer--20px" />
						<p>
							{position < meeting.agendaItems.length
								? "Estimated End Time:"
								: "Time Ended:"}
						</p>
						<p className="Text__header">
							{getEndTime(time, meeting.agendaItems)}
						</p>
						<div className="d-grid gap-2">
							<AgendaToggle
								agenda={meeting.agendaItems}
								time={time}
								id={meeting.id}
							/>
						</div>
						<div className="Buffer--20px" />
					</Col>
					<Col lg={1} md={12} sm={12} />
					<Col
						lg={6}
						md={12}
						sm={12}
						className="Container__padding--horizontal"
					>
						<Nav
							variant="tabs"
							defaultActiveKey="agenda"
							onSelect={(selectedKey) =>
								setCurrentTab(selectedKey)
							}
						>
							<Nav.Item>
								<Nav.Link eventKey="agenda">Agenda</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="participants">
									Participants
								</Nav.Link>
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

function AgendaToggle({ time, agenda, id }) {
	if (position < 0) {
		return (
			<Button onClick={() => startMeeting(time, agenda, id)}>
				Start Meeting
			</Button>
		);
	} else if (position < agenda.length) {
		return (
			<Button onClick={() => nextItem(time, agenda, id)}>Next Item</Button>
		);
	} else {
		return <Button disabled>Meeting Ended</Button>;
	}
}

async function startMeeting(time, agenda, id) {
	const ok = await callMeetingEndpoint('start', id)
	if (ok) {
		position++;
		initializeAgenda(time, agenda);
	}
}

function initializeAgenda(time, agenda) {
	var lastTiming = time;
	for (let i = 0; i < agenda.length; i++) {
		agenda[i].actualDuration = agenda[i].expectedDuration;
		agenda[i].startTime = lastTiming;
		lastTiming += agenda[i].actualDuration;
	}
}

async function callMeetingEndpoint(key, id) {
	const url = `${apiUrl}/meeting/${key}/${id}`;
	const accessToken = window.sessionStorage.getItem(accessTokenKey);
	const response = await fetch(url, {
		headers: {
			Authorization: "Bearer " + accessToken,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		method: "POST",
	});
	return response.ok
}

async function nextItem(time, agenda, id) {
	const key = position + 1 < agenda.length ? 'next' : 'end'
	const ok = await callMeetingEndpoint(key, id);
	if (ok) {
		agenda[position].actualDuration = time - agenda[position].startTime;
		position++;
		if (position < agenda.length) {
			agenda[position].startTime = time;
		}
	}
}

function updateDelay(agenda, time) {
	if (position < 0 || position >= agenda.length) return;
	const delay = Math.max(
		0,
		time - agenda[position].startTime - agenda[position].actualDuration
	);
	agenda[position].actualDuration += delay;
	updateAgenda(agenda);
}

function updateAgenda(agenda) {
	for (let i = 0; i < agenda.length; i++) {
		agenda[i].isCurrent = i === position;
	}
	if (position >= agenda.length) return;
	var lastTiming = agenda[position].startTime;
	for (let i = position; i < agenda.length; i++) {
		agenda[i].startTime = lastTiming;
		lastTiming += agenda[i].actualDuration;
	}
}

function syncMeeting(meeting) {
	if (meeting.type === 1) {
		// waiting to start
		return;
	} else if (meeting.type === 2) {
		// started
		const pos = getCurrentPosition(meeting)
		const agenda = meeting.agendaItems
		var lastTiming = agenda[pos].startTime;
		for (let i = pos; i < agenda.length; i++) {
			agenda[i].startTime = lastTiming;
			agenda[i].actualDuration = agenda[i].expectedDuration;
			lastTiming += agenda[i].actualDuration;
		}
		return;
	} else if (meeting.type === 3) {
		// meeting ended
		position = meeting.agendaItems.length
		return;
	}
}

function getCurrentPosition(meeting) {
	const agenda = meeting.agendaItems;
	for (let i = 0; i < agenda.length; i++) {
		if (agenda[i].isCurrent) {
			position = i;
			return i;
		}
	}
}

function getEndTime(time, agenda) {
	if (position < 0) {
		var duration = 0;
		agenda.forEach((item) => {
			duration += item.expectedDuration;
		});
		return getFormattedTime(new Date(time + duration));
	} else {
		var lastAgendaItem = agenda[agenda.length - 1];
		return getFormattedTime(
			new Date(lastAgendaItem.startTime + lastAgendaItem.actualDuration)
		);
	}
}

function dateTimeReviver(key, value) {
	if (typeof value === 'string' && key === 'startTime') {
		if (value) {
			return new Date(value).getTime();
		}
	}
	return value;
}
