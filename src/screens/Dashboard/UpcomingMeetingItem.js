import { Card, Col, Button, Toast, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getDateInfo, openLinkInNewTab } from '../../common/CommonFunctions';
import { useHistory } from 'react-router';
import server from '../../services/server';
import { useState } from 'react';

function DeleteErrorToast({show}) {
  return (
    <Toast show={show} >
      <Toast.Header>
        <strong className="me-auto">Error!</strong>
      </Toast.Header>
      <Toast.Body>
        Could not delete meeting, please try again later!
      </Toast.Body>
    </Toast>
  );
}

export default function UpcomingMeetingItem({ meeting, onDelete }) {
  const id = meeting.id;
  const topic = meeting.name;
  const desc = meeting.description;
  const startUrl = meeting.startUrl;

  const history = useHistory();
  function editMeeting() {
    console.log(`Editing meeting of ID = ${id}`);
    history.push(`/meeting/${id}`);
  }

  function startMeeting() {
    console.log(`Starting meeting of ID = ${id}`);
    meeting.type = 2;
    openLinkInNewTab(startUrl);
    history.push(`/ongoing/${id}`);
  }

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);
  function deleteMeeting() {
    if (deleting) return;

    setDeleting(true);
    return server.delete(`/meeting/${id}`)
      .then((_) => {
        onDelete();
        history.push('/home');
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setDeleting(false));
  }

  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const date = dateInfo.date;
  const startTime = dateInfo.startTime;
  const endTime = dateInfo.endTime;
  const duration = dateInfo.duration;

  return (
    <Col className="Container__padding--vertical-small">
      <Card bg={'light'}>
        <Card.Header>
          <Card.Text>Duration: {duration}</Card.Text>
        </Card.Header>
        <Card.Body>
          <Card.Title>{topic}</Card.Title>
          <Card.Subtitle>
            Date: {date} {startTime} - {endTime}
          </Card.Subtitle>

          <Card.Text>Description: {desc}</Card.Text>

          <div className="d-grid gap-2">
            <Container fluid>
              <Row>
                <Button variant="outline-primary" onClick={startMeeting} >
                  Start meeting
                </Button>
                <Button variant="outline-primary" onClick={editMeeting} >
                  Edit meeting
                </Button>
                <Button variant="outline-danger" onClick={deleteMeeting} disabled={deleting} >
                  { deleting ? "Deleting..." : "Delete meeting"}
                </Button>
                <DeleteErrorToast show={error} />
              </Row>
            </Container>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

UpcomingMeetingItem.propTypes = {
  meeting: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    startUrl: PropTypes.string.isRequired,
    startedAt: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
