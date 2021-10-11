import { Card, Col, Button } from 'react-bootstrap';
import { getDateInfo } from '../../common/CommonFunctions';

export default function CompletedMeetingItem({ meeting }) {
  const id = meeting.id;
  const topic = meeting.name;
  const desc = meeting.description;

  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const date = dateInfo.date;
  const startTime = dateInfo.startTime;
  const endTime = dateInfo.endTime;
  const duration = dateInfo.duration;

  function viewMeeting() {
    console.log(`Viewing meeting of ID = ${id}`);
  }

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
        </Card.Body>
      </Card>
    </Col>
  );
}
