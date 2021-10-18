import { Card, Col, Button, Row } from 'react-bootstrap';
import {
  markParticipantPresent,
  markParticipantAbsent,
  deleteParticipants as deleteParticipant,
} from '../../services/participants';
import { toast } from 'react-toastify';
import { extractError } from '../../utils/extractError';
import { useState } from 'react';
import ConfirmDupeModal from './ConfirmDupeModal';

export default function ParticipantList({
  meeting,
  setMeeting,
  position,
  shouldShowButton,
}) {
  const items = [];
  const participants = meeting.participants;
  const ended = position >= meeting.agendaItems.length;
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].timeJoined != null) {
      items.push(
        <PresentItem
          meeting={meeting}
          position={i}
          showButton={!ended && shouldShowButton}
          key={'Participant' + i}
        />,
      );
    } else {
      items.push(
        <AwaitItem
          meeting={meeting}
          position={i}
          showButton={!ended && shouldShowButton}
          key={'Participant' + i}
        />,
      );
    }
  }
  return <Row>{items}</Row>;
}

function AwaitItem({ meeting, position, showButton }) {
  const participant = meeting.participants[position];
  const displayName =
    participant.userName && participant.userName.length > 0
      ? participant.userName
      : 'Guest';
  return (
    <Col className="Container__padding--vertical-small" sm={12} md={6} lg={6}>
      <Card
        bg={showButton ? null : 'danger'}
        text={showButton ? 'dark' : 'light'}
      >
        <Card.Body>
          <Card.Title className="Text__elipsized--1-line">
            {displayName}
          </Card.Title>
          <Card.Text className="Text__elipsized--1-line">
            {participant.userEmail}
          </Card.Text>
          {showButton && participant.role !== 2 && (
            <div className="d-grid gap-2">
              <Button
                variant={showButton ? 'outline-primary' : 'outline-light'}
                onClick={() => markPresent(meeting, position)}
              >
                Mark as Present
              </Button>
              <MarkDuplicateButton
                meeting={meeting}
                position={position}
                showButton={showButton}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

function PresentItem({ meeting, position, showButton }) {
  const participant = meeting.participants[position];
  return (
    <Col className="Container__padding--vertical-small" sm={12} md={6} lg={6}>
      <Card bg="success" text="light">
        <Card.Body>
          <Card.Title className="Text__elipsized--1-line">
            {participant.userName != null && participant.userName.length > 0
              ? participant.userName
              : 'Guest'}
          </Card.Title>

          <Card.Text className="Text__elipsized--1-line">
            {participant.userEmail}
          </Card.Text>
          {showButton && participant.role !== 2 && (
            <div className="d-grid gap-2">
              <Button
                variant="outline-light"
                onClick={() => unmarkPresent(meeting, position)}
              >
                Mark as Absent
              </Button>
              <MarkDuplicateButton
                meeting={meeting}
                position={position}
                showButton={showButton}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

function MarkDuplicateButton({ meeting, position, showButton }) {
  const participant = meeting.participants[position];
  const [showModal, setShowModal] = useState(false);
  const markDupe = () => markDuplicate(meeting, position);
  return (
    <>
      <Button
        variant={showButton ? 'outline-primary' : 'outline-light'}
        onClick={() => setShowModal(true)}
      >
        Mark Participant As Duplicate
      </Button>
      <ConfirmDupeModal
        participant={participant}
        showModal={showModal}
        setShowModal={setShowModal}
        onMarkDuplicate={markDupe}
      />
    </>
  );
}

async function markPresent(meeting, position) {
  try {
    await markParticipantPresent(
      meeting.id,
      meeting.participants[position].userEmail,
    );
  } catch (error) {
    toast.error(extractError(error));
  }
}

async function unmarkPresent(meeting, position) {
  try {
    await markParticipantAbsent(
      meeting.id,
      meeting.participants[position].userEmail,
    );
  } catch (error) {
    toast.error(extractError(error));
  }
}

async function markDuplicate(meeting, position) {
  try {
    await deleteParticipant(
      meeting.id,
      meeting.participants[position].userEmail,
    );
  } catch (error) {
    toast.error(extractError(error));
  }
}
