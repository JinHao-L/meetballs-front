import { useRef } from "react";
import { Offcanvas, Form, Button } from "react-bootstrap";
import { blankMeeting } from "../common/ObjectTemplates";

export default function CreateMeetingOverlay({ show, setShow }) {
	const newMeeting = Object.assign({}, blankMeeting);
	const nameRef = useRef();
	const descriptionRef = useRef();

	function createMeeting() {
		//Upload and go to upcoming meeting screen
		newMeeting.createdAt = new Date().toISOString();
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
