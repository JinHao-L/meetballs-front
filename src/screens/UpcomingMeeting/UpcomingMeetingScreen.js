import { useState, useEffect } from "react";
import { Button, Row, Col, Container, Nav, Alert } from "react-bootstrap";
import { getFormattedDateTime } from "../../common/CommonFunctions";
import AgendaItemList from "./AgendaItemList";
import ParticipantItemList from "./ParticipantItemList";
import { PersonPlusFill, CalendarPlusFill } from "react-bootstrap-icons";
import {
	blankAgenda,
	blankMeeting,
	blankParticipant,
} from "../../common/ObjectTemplates";
import { testMeeting } from "../../common/TestData";
import EditMeetingOverlay from "./EditMeetingOverlay";
import { useHistory, Redirect, useParams } from "react-router";

export default function UpcomingMeetingScreen() {
	const [meeting, setMeeting] = useState(blankMeeting);
	const [restrictDescription, setRestrictDescription] = useState(true);
	const [currentTab, setCurrentTab] = useState("participants");
	const [showEditMeeting, setShowEditMeeting] = useState(false);
	const history = useHistory();

	const { id } = useParams();

	useEffect(() => {
		const pulledMeeting = testMeeting;
		// pulledMeeting.participant_lists.sort((p1, p2) => {
		// 	return (" " + p1.user_name).localeCompare(p2.user_name);
		// });
		pulledMeeting.agenda_items.sort((p1, p2) => {
			return p1.position - p2.position;
		});
		setMeeting(pulledMeeting);
	}, []);

	function startZoom() {
		meeting.status = "started";
		uploadChanges();
		window.open(meeting.start_url, "_blank");
		history.replace("/ongoing/" + id);
	}

	function uploadChanges() {}

	function Content() {
		if (currentTab === "participants") {
			return (
				<ParticipantItemList
					meeting={meeting}
					setMeeting={setMeeting}
				/>
			);
		} else {
			return <AgendaItemList meeting={meeting} setMeeting={setMeeting} />;
		}
	}

	function AddToggle() {
		if (currentTab === "participants") {
			return (
				<div
					className="Fab"
					onClick={() => addParticipant(meeting, setMeeting)}
				>
					<PersonPlusFill size={25} color="white" />
				</div>
			);
		}
		return (
			<div className="Fab" onClick={() => addAgenda(meeting, setMeeting)}>
				<CalendarPlusFill size={22} color="white" />
			</div>
		);
	}

	if (meeting.status === "started") {
		return <Redirect to={"/ongoing/" + id} />;
	}

	return (
		<>
			<div className="Container__alert">
				<div className="Container__center--horizontal">
					<Alert variant="danger">
						Made changes? Save them before leaving:&nbsp;&nbsp;
						<Button variant="danger" onClick={uploadChanges}>
							Save
						</Button>
					</Alert>
				</div>
			</div>
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
							<Button onClick={startZoom}>
								Start Zoom Meeting
							</Button>
							<Button variant="outline-primary">
								Email Participants
							</Button>
							<Button
								variant="outline-secondary"
								onClick={() => setShowEditMeeting(true)}
							>
								Edit / Delete Meeting
							</Button>
						</div>
						<p className="Text__subsubheader">Description</p>
						<p
							className={
								"Text__paragraph" +
								(restrictDescription
									? " Text__elipsized--5-lines"
									: "")
							}
						>
							{meeting.description}
						</p>
						<div className="d-grid gap-2">
							<Button
								variant="secondary"
								onClick={() =>
									setRestrictDescription(!restrictDescription)
								}
							>
								View {restrictDescription ? "More" : "Less"}
							</Button>
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
			<EditMeetingOverlay
				show={showEditMeeting}
				setShow={setShowEditMeeting}
				meeting={meeting}
				setMeeting={setMeeting}
			/>
			<AddToggle />
		</>
	);
}

function addParticipant(meeting, setMeeting) {
	if (
		meeting.participant_lists.findIndex((item) => item.user_email === "") >=
		0
	)
		return;
	const newMeeting = Object.assign({}, meeting);
	const newParticipant = Object.assign({}, blankParticipant);
	newParticipant.meeting_uuid = newMeeting.uuid;
	newMeeting.participant_lists = [
		...newMeeting.participant_lists,
		newParticipant,
	];
	setMeeting(newMeeting);
}

function addAgenda(meeting, setMeeting) {
	const newMeeting = Object.assign({}, meeting);
	const newAgenda = Object.assign({}, blankAgenda);
	newAgenda.meeting_uuid = newMeeting.uuid;
	newAgenda.position = newMeeting.agenda_items.length;
	newMeeting.agenda_items = [...newMeeting.agenda_items, newAgenda];
	setMeeting(newMeeting);
	console.log(newMeeting.agenda_items);
}
