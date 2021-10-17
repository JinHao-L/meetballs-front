import {
  Row,
  Col,
  Card,
  DropdownButton,
  Dropdown,
  Form,
  CloseButton,
  Button,
} from 'react-bootstrap';
import { useState } from 'react';
import { getFormattedDuration, isValidUrl } from '../../common/CommonFunctions';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { extractError } from '../../utils/extractError';

export default function EditAgendaItem({
  setLoading,
  setEditing,
  meeting,
  position,
  setMeeting,
}) {
  const item = meeting.agendaItems[position];
  const [duration, setDuration] = useState(item.expectedDuration);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [speaker, setSpeaker] = useState(item.speakerName || '');
  const [materials, setMaterials] = useState(item.speakerMaterials || '');

  function DurationItems() {
    return durationMinutes.map((duration) => (
      <Dropdown.Item
        key={'Duration' + duration.mils}
        onClick={() => {
          setDuration(duration.mils);
        }}
      >
        {duration.display}
      </Dropdown.Item>
    ));
  }

  async function updateChanges() {
    if (name.length === 0) {
      toast.error('Name must not be empty.');
      return;
    }
    const linkSubmitted = materials !== '';
    if (linkSubmitted && !isValidUrl(materials)) {
      console.log('Attempted to submit an invalid URL');
      toast.error('Attempted to submit an invalid URL');
      setMaterials('');
      return;
    }
    try {
      setLoading(true);
      const actualPosition = meeting.agendaItems[position].position;
      await updateDatabase(
        meeting.agendaItems[position].name,
        meeting.id,
        actualPosition,
        name,
        duration,
        description,
        speaker,
        materials,
      );
      meeting.agendaItems[position].name = name;
      meeting.agendaItems[position].expectedDuration = duration;
      meeting.agendaItems[position].description = description;
      meeting.agendaItems[position].speakerName = speaker;
      meeting.agendaItems[position].speakerMaterials = materials;
      setEditing(false);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  function SpeakerItems() {
    const choices = meeting.participants.map((participant) => (
      <Dropdown.Item
        key={participant.userEmail}
        onClick={() => {
          setSpeaker(participant.userName);
        }}
      >
        {participant.userName}
      </Dropdown.Item>
    ));
    choices.push(
      <Dropdown.Item
        key="null choice"
        onClick={() => {
          setSpeaker('');
          setMaterials('');
        }}
      >
        Remove speaker
      </Dropdown.Item>,
    );
    return choices;
  }

  function close() {
    const oldName = item.name;
    if (oldName === '') {
      const newMeeting = Object.assign({}, meeting);
      const newAgenda = newMeeting.agendaItems;
      newAgenda.splice(position, 1);
      newMeeting.agendaItems = newAgenda;
      setMeeting(newMeeting);
    } else {
      setEditing(false);
    }
  }

  return (
    <Col className="Container__padding--vertical-small">
      <Card>
        <Card.Header>
          <p className="Text__card-header">Editing Agenda Item</p>
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
              variant="outline-primary  "
              title={getFormattedDuration(duration)}
            >
              <DurationItems />
            </DropdownButton>
            <Form.Label column>Description</Form.Label>
            <Form.Control
              as="textarea"
              defaultValue={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Form.Label column>Speaker (optional)</Form.Label>
            <DropdownButton
              variant="outline-primary  "
              placeholder="Add presenter"
              title={speaker}
            >
              <SpeakerItems />
            </DropdownButton>
            <Form.Label column>Materials (optional)</Form.Label>
            <Form.Control
              value={materials}
              placeholder="Add a URL to your presentation materials"
              disabled={speaker === ''}
              onChange={(event) => setMaterials(event.target.value)}
            />
            <div className="Buffer--20px" />
            <Row>
              <Col>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" onClick={close}>
                    Cancel
                  </Button>
                </div>
              </Col>
              <Col>
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => updateChanges()}>
                    Confirm
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Group>
        </Card.Body>
      </Card>
    </Col>
  );
}

async function updateDatabase(
  oldName,
  meetingId,
  position,
  name,
  duration,
  description,
  speaker,
  materials,
) {
  const data = {
    name: name,
    description: description,
    startTime: null,
    expectedDuration: duration,
    actualDuration: null,
    isCurrent: false,
    meetingId: meetingId,
    position: position,
  };
  if (speaker !== '') data.speakerName = speaker;
  if (materials !== '') data.speakerMaterials = materials;

  if (oldName.length === 0) {
    await server.post(`/agenda-item`, data, defaultHeaders);
  } else {
    await server.put(
      `/agenda-item/${meetingId}/${position}`,
      data,
      defaultHeaders,
    );
  }
}

const durationMinutes = [
  { mils: 300000, display: '5m' },
  { mils: 600000, display: '10m' },
  { mils: 900000, display: '15m' },
  { mils: 1200000, display: '20m' },
  { mils: 1500000, display: '25m' },
  { mils: 1800000, display: '30m' },
  { mils: 2100000, display: '35m' },
  { mils: 2400000, display: '40m' },
  { mils: 2700000, display: '45m' },
  { mils: 3000000, display: '50m' },
  { mils: 3300000, display: '55m' },
  { mils: 3600000, display: '1h 0m' },
];
