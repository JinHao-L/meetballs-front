import {
  Col,
  Card,
  DropdownButton,
  Dropdown,
  Form,
  CloseButton,
  Button,
  Row,
} from 'react-bootstrap';
import { useState } from 'react';
import { getFormattedDuration, isValidUrl } from '../../common/CommonFunctions';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { extractError } from '../../utils/extractError';
import { uploadFile } from '../../services/files';

export default function EditAgendaItem({
  setLoading,
  setEditing,
  meeting,
  position,
}) {
  const item = meeting.agendaItems[position];
  const [duration, setDuration] = useState(item.expectedDuration);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [speaker, setSpeaker] = useState(item.speakerName || '');
  const [speakerId, setSpeakerId] = useState(item.speakerId || '');
  const [materials, setMaterials] = useState(item.speakerMaterials || '');
  const [file, setFile] = useState('');
  const [isUpload, setIsUpload] = useState(false);

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
    const linkSubmitted = materials !== '';
    let speakerMaterials = materials;
    if (speaker && isUpload) {
      try {
        const fileName = await uploadFile(file, meeting.id, speakerId);
        setMaterials(fileName);
        speakerMaterials = fileName;
      } catch (err) {
        if (err.response?.status === 400) {
          toast.error(err.response?.data?.message || 'Failed to upload file');
        } else {
          toast.error('Failed to upload file');
          console.log(err);
        }
        return;
      }
    } else if (
      speaker &&
      linkSubmitted &&
      !isValidUrl(materials) &&
      materials !== item.speakerMaterials
    ) {
      console.log('Attempted to submit an invalid URL');
      toast.error('Attempted to submit an invalid URL');
      setMaterials('');
      return;
    }

    try {
      setLoading(true);
      const actualPosition = meeting.agendaItems[position].position;
      await updateDatabase(
        meeting.id,
        actualPosition,
        name,
        duration,
        description,
        speaker,
        speakerId,
        speakerMaterials,
      );
      meeting.agendaItems[position].name = name;
      meeting.agendaItems[position].expectedDuration = duration;
      meeting.agendaItems[position].description = description;
      if (speaker !== item.speaker) meeting.agendaItems[position].speakerName = speaker;
      if (speakerId !== item.speakerId) meeting.agendaItems[position].speakerId = speakerId;
      if (speakerMaterials !== item.speakerMaterials)
        meeting.agendaItems[position].speakerMaterials = speakerMaterials;
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
          setSpeakerId(participant.id);
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
          setSpeakerId('');
          setMaterials('');
        }}
      >
        Remove speaker
      </Dropdown.Item>,
    );
    return choices;
  }

  return (
    <Col className="Container__padding--vertical-small">
      <Card>
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
              title={speaker || '(No speaker assigned)'}
            >
              <SpeakerItems />
            </DropdownButton>
            <Form.Group as={Row} hidden={speaker === ''}>
              <Form.Label column>Materials (optional)</Form.Label>
              <Form.Label
                column
                onClick={() => setIsUpload((prev) => !prev)}
                className="Clickable"
                disabled={speaker === ''}
                variant="primary"
                style={{ textAlign: 'right', color: '#725546' }}
              >
                {isUpload ? 'Use url' : 'Upload local file'}
              </Form.Label>
            </Form.Group>
            <Form.Control
              type="file"
              disabled={speaker === ''}
              hidden={speaker === '' || !isUpload}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Form.Control
              value={materials}
              hidden={speaker === '' || isUpload}
              placeholder="Add a URL to your presentation materials"
              disabled={speaker === ''}
              onChange={(event) => setMaterials(event.target.value)}
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
    </Col>
  );
}

async function updateDatabase(
  meetingId,
  position,
  name,
  duration,
  description,
  speaker,
  speakerId,
  materials,
) {
  const data = {
    name: name,
    description: description,
    startTime: null,
    expectedDuration: duration,
    actualDuration: null,
    isCurrent: false,
  };
  if (speaker !== '') data.speakerName = speaker;
  if (speakerId !== '') data.speakerId = speakerId;
  if (materials !== '') data.speakerMaterials = materials;
  console.log(data);
  await server.put(
    `/agenda-item/${meetingId}/${position}`,
    data,
    defaultHeaders,
  );
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
