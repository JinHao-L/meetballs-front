import { Offcanvas, Form, Button } from 'react-bootstrap';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import { extractError } from '../../utils/extractError';

export default function EditMeetingOverlay({
  show,
  setShow,
  meeting,
  setMeeting,
}) {
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const descriptionRef = useRef();
  const history = useHistory();

  async function update() {
    try {
      setLoading(true);
      const newMeeting = Object.assign({}, meeting);
      newMeeting.name = nameRef.current.value;
      newMeeting.description = descriptionRef.current.value;
      setMeeting(newMeeting);
      setShow(false);
      updateDatabase(newMeeting);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function deleteMeeting(meetingId) {
    try {
      setLoading(true);
      const response = await server.delete(
        `/meeting/${meetingId}`,
        defaultHeaders,
      );
      if (response.status === 200) {
        history.goBack();
      }
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Offcanvas show={show} onHide={() => setShow(false)}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit Meeting</Offcanvas.Title>
      </Offcanvas.Header>
      {loading ? (
        <FullLoadingIndicator />
      ) : (
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
            <Button variant="primary" onClick={update}>
              Update
            </Button>
            <div className="Buffer--20px" />
            <div className="Line--horizontal" />
            <div className="Buffer--20px" />
            <Button variant="danger" onClick={() => deleteMeeting(meeting.id)}>
              Delete Meeting
            </Button>
          </div>
        </Offcanvas.Body>
      )}
    </Offcanvas>
  );
}

async function updateDatabase(newMeeting) {
  await server.put(
    `/meeting/${newMeeting.id}`,
    {
      name: newMeeting.name,
      description: newMeeting.description,
      duration: newMeeting.duration,
      enableTranscription: newMeeting.enableTranscription,
    },
    defaultHeaders,
  );
}
