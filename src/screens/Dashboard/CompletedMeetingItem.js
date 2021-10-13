import { Card, Col, Row } from 'react-bootstrap';
import { getDateInfo } from '../../common/CommonFunctions';
import { useHistory } from 'react-router';
import { Eye } from 'react-bootstrap-icons';

export default function CompletedMeetingItem({ meeting }) {
  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const history = useHistory();

  function viewMeeting() {
    console.log(`Viewing meeting of ID = ${meeting.id}`);
    history.push(`/ongoing/${meeting.id}`);
  }

  function Details() {
    return (
      <div style={{ height: 210 }}>
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
      </div>
    );
  }

  function Toggles() {
    return (
      <Row>
        <Col onClick={viewMeeting} className="Toggle-card">
          <Eye />
          View
        </Col>
      </Row>
    );
  }

  return (
    <Col lg={4} md={6} sm={12} className="Container__padding--vertical-small">
      <Card style={{ height: 300, backgroundColor: '#e5e5e5' }}>
        <Card.Body>
          <Details />
          <div
            className="Line--horizontal"
            style={{ backgroundColor: '#c5c5c5' }}
          />
          <div className="Buffer--5px" />
          <Toggles />
        </Card.Body>
      </Card>
    </Col>
  );
}
