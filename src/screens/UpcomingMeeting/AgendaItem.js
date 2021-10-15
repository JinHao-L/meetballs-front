import { Button, Row, Col, Card } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { getFormattedDuration } from '../../common/CommonFunctions';
import EditAgendaItem from './EditAgendaItem';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';

export default function AgendaItem({
  meeting,
  setMeeting,
  position,
  isReordering,
}) {
  const [editing, setEditing] = useState(false);
  const item = meeting.agendaItems[position];

  function removeAgendaItem() {
    const newMeeting = Object.assign({}, meeting);
    const newAgenda = newMeeting.agendaItems;
    const actualPosition = newAgenda[position].position;
    newAgenda.splice(position, 1);
    for (let i = 0; i < newAgenda.length; i++) {
      newAgenda[i].position = i;
    }
    newMeeting.agendaItems = newAgenda;
    removeFromDatabase(meeting.id, actualPosition);
    setMeeting(newMeeting);
  }

  if (isReordering && editing) {
    setEditing(false);
  }

  if (editing) {
    // Editing
    return (
      <Draggable
        draggableId={'Draggable' + item.position}
        index={position}
        isDragDisabled={true}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <EditAgendaItem
              setEditing={setEditing}
              setMeeting={setMeeting}
              meeting={meeting}
              position={position}
            />
          </div>
        )}
      </Draggable>
    );
  }

  // Not editing
  return (
    <Draggable
      draggableId={'Draggable' + item.position}
      index={position}
      isDragDisabled={!isReordering}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Col className="Container__padding--vertical-small">
            <Card>
              <Card.Header>
                {getFormattedDuration(item.expectedDuration)}
              </Card.Header>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                {isReordering || (
                  <Row>
                    <Col>
                      <div className="d-grid gap-2">
                        <Button variant="danger" onClick={removeAgendaItem}>
                          Remove
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          onClick={() => setEditing(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </div>
      )}
    </Draggable>
  );
}

async function removeFromDatabase(meetingId, position) {
  await server.delete(`/agenda-item/${meetingId}/${position}`, defaultHeaders);
}
