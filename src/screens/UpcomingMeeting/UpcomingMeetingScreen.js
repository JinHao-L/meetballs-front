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
import EditMeetingOverlay from "./EditMeetingOverlay";

export default function UpcomingMeetingScreen() {
	const [meeting, setMeeting] = useState(blankMeeting);
	const [restrictDescription, setRestrictDescription] = useState(true);
	const [currentTab, setCurrentTab] = useState("participants");
	const [showEditMeeting, setShowEditMeeting] = useState(false);

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
		window.open(meeting.start_url, "_blank");
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

const testMeeting = {
	name: "Meetballs Annual Eating Contest",
	description:
		"Pellentesque vestibulum dolor in tortor scelerisque, eu laoreet felis mattis. Duis ac mauris a ligula scelerisque commodo in sit amet est. Proin ac semper neque. Integer a sagittis velit, ac finibus risus. Curabitur blandit, nulla ut scelerisque interdum, tortor elit tristique quam, eu tempus ipsum tortor eu neque. Cras molestie eget enim vitae fringilla. In eget nibh tristique nunc porttitor eleifend ut in felis. Nam egestas mauris in augue suscipit cursus. Vivamus eget ornare ante, finibus pulvinar justo. Fusce sit amet dapibus neque, non euismod massa. Nunc elementum purus pretium elit luctus finibus. Nunc eu augue quis purus posuere sollicitudin quis non eros. Curabitur rutrum faucibus ipsum non tristique. Maecenas mattis eget diam at gravida.",
	created_at: "//Zoom date",
	duration: "//Zoom duration",
	host_id: "//Zoom host id",
	uuid: "//Meeting id",
	start_url: "https://zoom.us/",
	join_url: "https://zoom.us/",
	status: "waiting",
	start_time: "2021-11-01T22:00:00Z",
	enable_transcription: true,
	transcription: "",
	video_url: "",
	agenda_items: [
		{
			meeting_uuid: "//Meeting id",
			position: 1,
			item_name: "Commencement of category 1 eating contest.",
			item_description:
				"Integer egestas gravida gravida. Suspendisse potenti. Curabitur id accumsan velit. Nulla volutpat tellus et erat scelerisque tincidunt. Proin ac semper nunc. Quisque tempus elit ut sem laoreet, sed semper mauris imperdiet. Sed consequat bibendum elementum. Nullam scelerisque, mi vel malesuada blandit, mauris odio pulvinar leo, eu finibus nisl ligula ut massa.",
			start_time: null,
			actual_duration: null,
			expected_duration: 3600000,
			isCurrent: false,
		},
		{
			meeting_uuid: "//Meeting id",
			position: 0,
			item_name: "Opening address by CEO of Meetballs Inc.",
			item_description:
				"Vestibulum vitae convallis diam. Sed molestie odio vitae urna sodales pellentesque. Suspendisse ipsum urna, accumsan in tincidunt vitae, sodales eleifend lacus. Nunc rutrum ultrices velit, at mollis lorem vestibulum et. Etiam venenatis sapien nisl, eget condimentum velit accumsan sed. Integer maximus molestie ante, in fringilla turpis vestibulum et.",
			start_time: null,
			actual_duration: null,
			expected_duration: 300000,
			isCurrent: false,
		},
	],
	participant_lists: [
		{
			meeting_uuid: "//Meeting id",
			user_name: "Meetball 2",
			user_email: "meetball2@meetmail.com",
			time_joined: null,
		},
		{
			meeting_uuid: "//Meeting id",
			user_name: "Meetball 1",
			user_email: "meetball1@meetmail.com",
			time_joined: null,
		},
	],
	password_hash: "b263c97345237b1da24cddfedace92d239d2697a",
};
