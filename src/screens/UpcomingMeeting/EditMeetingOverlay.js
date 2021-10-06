import { Offcanvas, Form, Button } from "react-bootstrap";
import { useRef } from "react";

export default function EditMeetingOverlay({
	show,
	setShow,
	meeting,
	setMeeting,
}) {
	const nameRef = useRef();
	const descriptionRef = useRef();

	function update() {
		const newMeeting = Object.assign({}, meeting);
		newMeeting.name = nameRef.current.value;
		newMeeting.description = descriptionRef.current.value;
		setMeeting(newMeeting);
		setShow(false);
	}

	return (
		<Offcanvas show={show} onHide={() => setShow(false)}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Edit Meeting</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Form.Group>
					<Form.Label column>Meeting Name</Form.Label>
					<Form.Control defaultValue={meeting.name} ref={nameRef} />
					<Form.Label column>Description</Form.Label>
					<Form.Control
						as="textarea"
						style={{ height: 200 }}
						defaultValue={meeting.description}
						ref={descriptionRef}
					/>
				</Form.Group>
				<div className="Buffer--20px" />
				<div className="d-grid gap-2">
					<Button variant="secondary" onClick={update}>
						Update
					</Button>
					<div className="Buffer--20px" />
					<div className="Line--horizontal" />
					<div className="Buffer--20px" />
					<Button variant="outline-danger">Delete Meeting</Button>
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
