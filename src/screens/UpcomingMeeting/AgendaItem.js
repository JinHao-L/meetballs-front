import {
	Button,
	Row,
	Col,
	Card,
	DropdownButton,
	Dropdown,
	Form,
	CloseButton,
} from "react-bootstrap";
import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { getFormattedDuration } from "../../common/CommonFunctions";

export default function AgendaItem({ meeting, setMeeting, position }) {
	const [editing, setEditing] = useState(false);
	const item = meeting.agenda_items[position];
	const [duration, setDuration] = useState(item.expected_duration);

	function DurationItems() {
		const items = [];
		durationMinutes.forEach((duration) =>
			items.push(
				<Dropdown.Item
					onClick={() => {
						item.expected_duration = duration.mils;
						setDuration(duration.mils);
					}}
				>
					{duration.display}
				</Dropdown.Item>
			)
		);
		return items;
	}

	if (editing) {
		// Editing
		return (
			<Draggable
				draggableId={"Draggable" + item.position}
				index={position}
			>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
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
											Editing Agenda Item
										</p>
										<CloseButton
											onClick={() => setEditing(false)}
										/>
									</div>
								</Card.Header>
								<Card.Body>
									<Form.Group>
										<Form.Label column>Name</Form.Label>
										<Form.Control
											defaultValue={item.item_name}
											onChange={(event) =>
												(item.item_name =
													event.target.value)
											}
										/>
										<Form.Label column>Duration</Form.Label>
										<DropdownButton
											variant="outline-secondary"
											title={getFormattedDuration(
												duration
											)}
										>
											{DurationItems()}
										</DropdownButton>
										<Form.Label column>
											Description
										</Form.Label>
										<Form.Control
											as="textarea"
											defaultValue={item.item_description}
											onChange={(event) =>
												(item.item_description =
													event.target.value)
											}
										/>
									</Form.Group>
								</Card.Body>
							</Card>
						</Col>
					</div>
				)}
			</Draggable>
		);
	}

	// Not editing
	return (
		<Draggable draggableId={"Draggable" + item.position} index={position}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<Col
						className="Container__padding--vertical-small"
						lg={8}
						md={12}
						sm={12}
					>
						<Card bg="light">
							<Card.Header>
								{getFormattedDuration(item.expected_duration)}
							</Card.Header>
							<Card.Body>
								<Card.Title>{item.item_name}</Card.Title>
								<Card.Text>{item.item_description}</Card.Text>
								<Row>
									<Col>
										<div className="d-grid gap-2">
											<Button
												variant="outline-danger"
												onClick={() =>
													removeAgendaItem(
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
				</div>
			)}
		</Draggable>
	);
}

function removeAgendaItem(setMeeting, meeting, position) {
	const newMeeting = Object.assign({}, meeting);
	const newAgenda = newMeeting.agenda_items;
	newAgenda.splice(position, 1);
	for (let i = 0; i < newAgenda.length; i++) {
		newAgenda[i].position = i;
	}
	newMeeting.agenda_items = newAgenda;
	setMeeting(newMeeting);
}

const durationMinutes = [
	{ mils: 300000, display: "5 m" },
	{ mils: 600000, display: "10 m" },
	{ mils: 900000, display: "15 m" },
	{ mils: 1200000, display: "20 m" },
	{ mils: 1500000, display: "25 m" },
	{ mils: 1800000, display: "30 m" },
	{ mils: 2100000, display: "35 m" },
	{ mils: 2400000, display: "40 m" },
	{ mils: 2700000, display: "45 m" },
	{ mils: 3000000, display: "50 m" },
	{ mils: 3300000, display: "55 m" },
	{ mils: 3600000, display: "1 h 0 m" },
];
