import { useState, useEffect } from "react";
import { Button, Row, Col, Container, Nav } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function UpcomingMeetingScreen() {
	const [meeting, setMeeting] = useState(blankMeeting);
	const [restrictDescription, setRestrictDescription] = useState(true);
	const [currentTab, setCurrentTab] = useState("participants");

	useEffect(() => {
		const pulledMeeting = testMeeting;
		pulledMeeting.participant_lists.sort((p1, p2) => {
			return (" " + p1.user_name).localeCompare(p2.user_name);
		});
		pulledMeeting.agenda_items.sort((p1, p2) => {
			return p1.position - p2.position;
		});
		setMeeting(pulledMeeting);
	}, []);

	function startZoom() {
		window.open(meeting.start_url, "_blank");
	}

	return (
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
						<Button onClick={startZoom}>Start Zoom Meeting</Button>
						<Button variant="outline-primary">
							Email Participants
						</Button>
						<Button variant="outline-secondary">
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
						variant="pills"
						defaultActiveKey="participants"
						onSelect={(selectedKey) => setCurrentTab(selectedKey)}
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
					<Content
						currentTab={currentTab}
						meeting={meeting}
						setMeeting={setMeeting}
					/>
				</Col>
			</Row>
		</Container>
	);
}

function getFormattedDateTime(isoDate) {
	const date = new Date(isoDate);
	const options = {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	};
	return date.toLocaleString("en-us", options);
}

function Content({ currentTab, meeting, setMeeting }) {
	if (currentTab === "participants") {
		return getParticipantList(meeting.participant_lists);
	} else {
		return getAgendaList(meeting, setMeeting);
	}
}

function getParticipantList(participants) {
	const items = [];
	participants.forEach((participant) => {
		items.push(
			<Col
				className="Container__item-box"
				key={participant.user_email}
				lg={8}
				md={12}
				sm={12}
			>
				<p className="Text__subsubheader">{participant.user_name}</p>
				<p className="Text__paragraph">{participant.user_email}</p>
			</Col>
		);
	});
	return items;
}

function getAgendaList(meeting, setMeeting) {
	const items = [];
	for (let i = 0; i < meeting.agenda_items.length; i++) {
		const item = meeting.agenda_items[i];
		items.push(
			<Draggable
				key={"Item" + item.position}
				draggableId={"Draggable" + item.position}
				index={i}
			>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						<Col
							className="Container__item-box"
							lg={8}
							md={12}
							sm={12}
						>
							<p className="Text__subsubheader">
								{item.item_name}
							</p>

							<p className="Text__paragraph">
								{item.item_description}
							</p>
						</Col>
					</div>
				)}
			</Draggable>
		);
	}
	return (
		<DragDropContext
			onDragEnd={(result) => onDragEnd(result, meeting, setMeeting)}
		>
			<Droppable droppableId="Agenda">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{items}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

function onDragEnd(result, meeting, setMeeting) {
	const { destination, source } = result;
	if (destination === null) return;
	if (
		destination.droppableId === source.droppableId &&
		destination.index === source.index
	)
		return;
	const newMeeting = Object.assign({}, meeting);
	const newAgenda = newMeeting.agenda_items;
	const item = newAgenda.splice(source.index, 1);
	newAgenda.splice(destination.index, 0, item[0]);
	newMeeting.agenda_items = newAgenda;
	setMeeting(newMeeting);
}

const blankMeeting = {
	name: "",
	description: "",
	created_at: "",
	duration: "",
	host_id: "",
	uuid: "",
	start_url: "",
	join_url: "",
	status: "",
	start_time: "1999-24-06T22:00:00Z",
	enable_transcription: false,
	transcription: "",
	video_url: "",
	agenda_items: [],
	participant_lists: [],
	password_hash: "",
};

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
			expected_duration: 600000,
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
