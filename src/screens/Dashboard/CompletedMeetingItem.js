import { useState } from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { getDateInfo } from '../../common/CommonFunctions';
import { useHistory } from 'react-router';

export default function CompletedMeetingItem({ meeting }) {
  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const [hovering, setHovering] = useState(false);
  const history = useHistory();

  function viewMeeting() {
    console.log(`Viewing meeting of ID = ${meeting.id}`);
    history.push(`/ongoing/${meeting.id}`);
  }

  function Details() {
    return (
      <Card.Body>
        <Card.Title className="Text__elipsized--1-line">
          {meeting.name}
        </Card.Title>
        <div className="Buffer--10px" />
        <Card.Subtitle className="Text__elipsized--1-line">
          ENDED - {dateInfo.date} {dateInfo.endTime}
        </Card.Subtitle>
        <div className="Buffer--20px" />
        <Card.Text className="Text__elipsized--5-lines">
          {meeting.description}
        </Card.Text>
      </Card.Body>
    );
  }

  function Toggles() {
    return (
      <Card.Body>
        <Card.Title className="Text__elipsized--1-line">
          {meeting.name}
        </Card.Title>
        <div className="Buffer--10px" />
        <div className="Container__column--space-between">
          <Button variant="primary" onClick={viewMeeting}>
            View Meeting
          </Button>
        </div>
      </Card.Body>
    );
  }

  return (
    <Col lg={4} md={6} sm={12} className="Container__padding--vertical-small">
      <Card
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ height: 230, backgroundColor: '#e5e5e5' }}
      >
        {hovering ? Toggles() : Details()}
      </Card>
    </Col>
  );
}
