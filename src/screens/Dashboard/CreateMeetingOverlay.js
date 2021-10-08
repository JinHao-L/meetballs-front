import { useRef, useState } from "react";
import { Offcanvas, Form, Button } from "react-bootstrap";
import { DateTime } from "react-datetime-bootstrap";
import { accessTokenKey, apiUrl } from "../../common/CommonValues";

export default function CreateMeetingOverlay({ show, setShow }) {
	const nameRef = useRef();
	const descriptionRef = useRef();
	const hostLinkRef = useRef();
	const linkRef = useRef();
	const [startDate, setStartDate] = useState(new Date());

	async function createMeeting() {
		//Upload and go to upcoming meeting screen
		const url = apiUrl + "/meeting";
		const accessToken = window.sessionStorage.getItem(accessTokenKey);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + accessToken,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: nameRef.current.value,
				description: descriptionRef.current.value,
				duration: 30000,
				meetingId: "",
				startUrl: hostLinkRef.current.value,
				joinUrl: linkRef.current.value,
				enableTranscription: true,
				participants: [],
				agendaItems: [],
			}),
		});
		const error = await response.text();
		console.log(error);
		if (response.status === 200) {
			const result = await response.json();
			console.log(result);
		}
	}

	return (
		<Offcanvas show={show} onHide={setShow}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Create Meeting</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Form.Group>
					<Form.Label column>Meeting Name</Form.Label>
					<Form.Control ref={nameRef} />
					<Form.Label column>Host Meeting Link</Form.Label>
					<Form.Control ref={hostLinkRef} />
					<Form.Label column>Participant Meeting Link</Form.Label>
					<Form.Control ref={linkRef} />
					<Form.Label column>Start Date {"&"} Time</Form.Label>
					<DateTime
						value={startDate.toISOString()}
						onChange={(value) => setStartDate(new Date(value))}
					/>

					<Form.Label column>Description</Form.Label>
					<Form.Control
						as="textarea"
						style={{ height: 200 }}
						ref={descriptionRef}
					/>
				</Form.Group>
				<div className="Buffer--20px" />
				<div className="d-grid gap-2">
					<Button variant="secondary" onClick={createMeeting}>
						Create
					</Button>
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
