import {
	Button,
	Row,
	Col,
	Card,
	CloseButton,
	Form,
	Modal,
} from "react-bootstrap";
import { useState } from "react";

export default function ParticipantItem({ setMeeting, meeting, position }) {
	const [editing, setEditing] = useState(false);
	const participant = meeting.participant_lists[position];
	const [showModal, setShowModal] = useState(false);

	if (!editing && participant.user_email.length === 0) {
		setEditing(true);
	}

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
							<CloseButton
								onClick={() => {
									if (participant.user_email.length === 0) {
										setShowModal(true);
									} else {
										setEditing(false);
									}
								}}
							/>
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
				<Modal
					show={showModal}
					onHide={() => setShowModal(false)}
					centered
				>
					<Modal.Header>
						<Modal.Title>Confirm?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="Text__paragraph">
							You have not specified an email, so this participant
							will be deleted if you choose to close. Would you
							still like to close?
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="outline-secondary"
							onClick={() => setShowModal(false)}
						>
							Cancel
						</Button>
						<Button
							variant="secondary"
							onClick={() =>
								removeParticipant(setMeeting, meeting, position)
							}
						>
							Confirm
						</Button>
					</Modal.Footer>
				</Modal>
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
					<Card.Title>
						{participant.user_name.length > 0
							? participant.user_name
							: "Guest"}
					</Card.Title>
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
