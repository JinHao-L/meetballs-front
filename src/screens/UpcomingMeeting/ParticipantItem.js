import { Button, Row, Col, Card, CloseButton, Form } from "react-bootstrap";
import { useState } from "react";

export default function ParticipantItem({ setMeeting, meeting, position }) {
	const [editing, setEditing] = useState(false);
	const participant = meeting.participant_lists[position];

	if (editing) {
		// Editing
		return (
			<Col
				className="Container__padding--vertical-small"
				lg={8}
				md={12}
				sm={12}
			>
				<Card bg="light">
					<Card.Header>
						<div className="Container__row--space-between">
							<p className="Text__card-header">
								Editing Participant
							</p>
							<CloseButton onClick={() => setEditing(false)} />
						</div>
					</Card.Header>
					<Card.Body>
						<Form.Group>
							<Form.Label column>Name</Form.Label>
							<Form.Control
								defaultValue={participant.user_name}
								onChange={(event) =>
									(participant.user_name = event.target.value)
								}
							/>
							<Form.Label column>Email</Form.Label>
							<Form.Control
								defaultValue={participant.user_email}
								onChange={(event) =>
									(participant.user_email =
										event.target.value)
								}
							/>
						</Form.Group>
					</Card.Body>
				</Card>
			</Col>
		);
	}

	// Not editing
	return (
		<Col
			className="Container__padding--vertical-small"
			lg={8}
			md={12}
			sm={12}
		>
			<Card bg="light">
				<Card.Body>
					<Card.Title>{participant.user_name}</Card.Title>
					<Card.Text>{participant.user_email}</Card.Text>
					<Row>
						<Col>
							<div className="d-grid gap-2">
								<Button
									variant="outline-danger"
									onClick={() =>
										removeParticipant(
											setMeeting,
											meeting,
											position
										)
									}
								>
									Remove
								</Button>
							</div>
						</Col>
						<Col>
							<div className="d-grid gap-2">
								<Button
									variant="outline-secondary"
									onClick={() => setEditing(true)}
								>
									Edit
								</Button>
							</div>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);
}

function removeParticipant(setMeeting, meeting, position) {
	const newMeeting = Object.assign({}, meeting);
	const newParticipants = newMeeting.participant_lists;
	newParticipants.splice(position, 1);
	newMeeting.participant_lists = newParticipants;
	setMeeting(newMeeting);
}
