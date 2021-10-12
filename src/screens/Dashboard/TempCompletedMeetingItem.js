import { useState } from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { getDateInfo } from '../../common/CommonFunctions';

export default function TempCompletedMeetingItem({ meeting }) {
  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const [hovering, setHovering] = useState(false);

  function Details() {
    return (
      <Card.Body>
        <Card.Title>{meeting.name}</Card.Title>
        <div className="Buffer--10px" />
        <Card.Subtitle>
          {dateInfo.date} - ENDED {dateInfo.endTime}
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
        <Card.Title>{meeting.name}</Card.Title>
        <div className="Buffer--10px" />
        <div className="Container__column--space-between"></div>
      </Card.Body>
    );
  }

  return (
    <Col lg={4} md={6} sm={12} className="Container__padding--vertical-small">
      <Card
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ height: 230, backgroundColor: '#e5e5e5' }}
      >
        {hovering ? Toggles() : Details()}
      </Card>
    </Col>
  );
}
