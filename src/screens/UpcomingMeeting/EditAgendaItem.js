import {
	Col,
	Card,
	DropdownButton,
	Dropdown,
	Form,
	CloseButton,
	Button,
} from "react-bootstrap";
import { useState } from "react";
import { accessTokenKey, apiUrl } from "../../common/CommonValues";
import { getFormattedDuration } from "../../common/CommonFunctions";

export default function EditAgendaItem({
	setEditing,
	meeting,
	setMeeting,
	position,
}) {
	const item = meeting.agendaItems[position];
	const [duration, setDuration] = useState(item.expectedDuration);
	const [name, setName] = useState(item.name);
	const [description, setDescription] = useState(item.description);

	function DurationItems() {
		const items = [];
		durationMinutes.forEach((duration) =>
			items.push(
				<Dropdown.Item
					key={"Duration" + duration.mils}
					onClick={() => {
						setDuration(duration.mils);
					}}
				>
					{duration.display}
				</Dropdown.Item>
			)
		);
		return items;
	}

	async function updateChanges() {
		const actualPosition = meeting.agendaItems[position].position;
		await updateDatabase(
			meeting.id,
			actualPosition,
			name,
			duration,
			description
		);
		meeting.agendaItems[position].name = name;
		meeting.agendaItems[position].expectedDuration = duration;
		meeting.agendaItems[position].description = description;
		setEditing(false);
	}

	return (
		<Col className="Container__padding--vertical-small">
			<Card bg="light">
				<Card.Header>
					<div className="Container__row--space-between">
						<p className="Text__card-header">Editing Agenda Item</p>
						<CloseButton onClick={() => setEditing(false)} />
					</div>
				</Card.Header>
				<Card.Body>
					<Form.Group>
						<Form.Label column>Name</Form.Label>
						<Form.Control
							defaultValue={name}
							onChange={(event) => setName(event.target.value)}
						/>
						<Form.Label column>Duration</Form.Label>
						<DropdownButton
							variant="outline-secondary"
							title={getFormattedDuration(duration)}
						>
							{DurationItems()}
						</DropdownButton>
						<Form.Label column>Description</Form.Label>
						<Form.Control
							as="textarea"
							defaultValue={description}
							onChange={(event) =>
								setDescription(event.target.value)
							}
						/>
						<div className="Buffer--20px" />
						<div className="d-grid gap-2">
							<Button
								variant="primary"
								onClick={() => updateChanges()}
							>
								Confirm
							</Button>
						</div>
					</Form.Group>
				</Card.Body>
			</Card>
		</Col>
	);
}

async function updateDatabase(
	meetingId,
	position,
	name,
	duration,
	description
) {
	var url = apiUrl + "/agenda-item/" + meetingId + "/" + position;
	const accessToken = window.sessionStorage.getItem(accessTokenKey);
	await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: "Bearer " + accessToken,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: "Bearer " + accessToken,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: name,
			description: description,
			startTime: null,
			expectedDuration: duration,
			actualDuration: null,
			isCurrent: false,
		}),
	});
}

const durationMinutes = [
	{ mils: 300000, display: "5min" },
	{ mils: 600000, display: "10min" },
	{ mils: 900000, display: "15min" },
	{ mils: 1200000, display: "20min" },
	{ mils: 1500000, display: "25min" },
	{ mils: 1800000, display: "30min" },
	{ mils: 2100000, display: "35min" },
	{ mils: 2400000, display: "40min" },
	{ mils: 2700000, display: "45min" },
	{ mils: 3000000, display: "50min" },
	{ mils: 3300000, display: "55min" },
	{ mils: 3600000, display: "1h 0min" },
];
