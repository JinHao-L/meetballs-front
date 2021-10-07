import { Card, Col, Button } from "react-bootstrap";

export default function ParticipantList({ meeting, setMeeting, position }) {
	const items = [];
	const participants = meeting.participant_lists;
	const ended = position >= meeting.agenda_items.length;
	for (let i = 0; i < participants.length; i++) {
		if (participants[i].time_joined != null) {
			items.push(
				<PresentItem
					meeting={meeting}
					setMeeting={setMeeting}
					position={i}
					ended={ended}
				/>
			);
		} else {
			items.push(
				<AwaitItem
					meeting={meeting}
					setMeeting={setMeeting}
					position={i}
					started={position >= 0}
					ended={ended}
				/>
			);
		}
	}
	return items;
}

function AwaitItem({ meeting, setMeeting, position, started, ended }) {
	const participant = meeting.participant_lists[position];
	return (
		<Col className="Container__padding--vertical-small">
			<Card
				bg={started ? "danger" : "light"}
				text={started ? "light" : "dark"}
			>
				<Card.Body>
					<Card.Title>{participant.user_name}</Card.Title>
					<Card.Text>{participant.user_email}</Card.Text>
					{!ended && (
						<div className="d-grid gap-2">
							<Button
								variant={
									started
										? "outline-light"
										: "outline-secondary"
								}
								onClick={() =>
									markPresent(meeting, setMeeting, position)
								}
							>
								Mark as Present
							</Button>
						</div>
					)}
				</Card.Body>
			</Card>
		</Col>
	);
}

function PresentItem({ meeting, setMeeting, position, ended }) {
	const participant = meeting.participant_lists[position];
	return (
		<Col className="Container__padding--vertical-small">
			<Card bg="success" text="light">
				<Card.Body>
					<Card.Title>{participant.user_name}</Card.Title>
					<Card.Text>{participant.user_email}</Card.Text>
					{!ended && (
						<div className="d-grid gap-2">
							<Button
								variant="outline-light"
								onClick={() =>
									unmarkPresent(meeting, setMeeting, position)
								}
							>
								Undo Mark as Present
							</Button>
						</div>
					)}
				</Card.Body>
			</Card>
		</Col>
	);
}

function markPresent(meeting, setMeeting, position) {
	const newMeeting = Object.assign({}, meeting);
	newMeeting.participant_lists[position].time_joined =
		new Date().toISOString();
	setMeeting(meeting);
	updateStatus(meeting, position, true);
}

function unmarkPresent(meeting, setMeeting, position) {
	const newMeeting = Object.assign({}, meeting);
	newMeeting.participant_lists[position].time_joined = null;
	setMeeting(meeting);
	updateStatus(meeting, position, false);
}

function updateStatus(meeting, position, isPresent) {}
