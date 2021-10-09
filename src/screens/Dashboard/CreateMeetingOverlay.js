import { useRef, useState } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { accessTokenKey, apiUrl } from '../../common/CommonValues';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreateMeetingOverlay({ show, setShow }) {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const hostLinkRef = useRef();
  const linkRef = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const history = useHistory();

  async function createMeeting() {
    //Upload and go to upcoming meeting screen
    const url = apiUrl + '/meeting';
    const accessToken = window.sessionStorage.getItem(accessTokenKey);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        startedAt: startDate,
        duration: 30000,
        meetingId: '',
        startUrl: hostLinkRef.current.value,
        joinUrl: linkRef.current.value,
        enableTranscription: true,
      }),
    });
    if (response.status === 201) {
      const result = await response.json();
      history.push('/meeting/' + result.id);
      setShow(false);
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
          <Form.Label column>Start Date {'&'} Time</Form.Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            customInput={<Form.Control />}
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
