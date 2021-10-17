import { useState } from 'react';
import { isNil } from 'lodash';
import {
  Button,
  Col,
  Card,
  CloseButton,
  Form,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { extractError } from '../../utils/extractError';

export default function EditParticipantItem({
  setEditing,
  setMeeting,
  meeting,
  position,
  removeParticipant,
}) {
  const [showModal, setShowModal] = useState(false);
  const participant = meeting.participants[position];
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(participant.userEmail);
  const [username, setUsername] = useState(participant.userName);

  const checkForDuplicate = () => {
    return !isNil(
      meeting.participants.find(
        (participant) => participant.userEmail === email,
      ),
    );
  };

  async function updateChanges() {
    if (email.length === 0) {
      setShowModal(true);
      return;
    }
    if (participant.userName === username && checkForDuplicate()) {
      toast.error(`Participant with email ${email} already exist`);
      return;
    }
    const oldEmail = meeting.participants[position].userEmail;
    try {
      setLoading(true);
      const newParticipant = await updateDatabase(meeting.id, email, username, oldEmail);
      meeting.participants[position] = newParticipant;
      setEditing(false);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  function close() {
    const oldEmail = meeting.participants[position].userEmail;
    if (oldEmail === '') {
      const newMeeting = Object.assign({}, meeting);
      const newParticipants = newMeeting.participants;
      newParticipants.splice(position, 1);
      newMeeting.participants = newParticipants;
      setMeeting(newMeeting);
    } else if (oldEmail.length > 0) {
      setEditing(false);
    } else {
      removeParticipant(setMeeting, meeting, position);
    }
  }

  return (
    <Col className="Container__padding--vertical-small">
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card>
          <Card.Header>
            <div className="Container__row--space-between">
              <p className="Text__card-header">Editing Participant</p>
              <CloseButton
                size="sm"
                style={{ borderRadius: 50 }}
                onClick={close}
              />
            </div>
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label column>Name</Form.Label>
              <Form.Control
                defaultValue={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Form.Label column>Email</Form.Label>
              <Form.Control
                defaultValue={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <div className="Buffer--20px" />
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={() => updateChanges()}>
                  Confirm
                </Button>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Confirm?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="Text__paragraph">
            You have not specified an email, so this participant will be deleted
            if you choose to close. Would you still like to close?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => removeParticipant(setMeeting, meeting, position)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
}

async function updateDatabase(meetingId, newEmail, newUsername, oldEmail) {
  if (oldEmail.length !== 0) {
    await server.delete('/participant', {
      data: {
        participants: [{ userEmail: oldEmail }],
        meetingId: meetingId,
      },
      ...defaultHeaders,
    });
  }
  const result = await server.post(
    '/participant',
    {
      meetingId: meetingId,
      userEmail: newEmail,
      userName: newUsername,
    },
    defaultHeaders,
  );
  return result.data
}
