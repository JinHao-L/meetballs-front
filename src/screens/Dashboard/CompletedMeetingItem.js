import { Card, Col, Button } from 'react-bootstrap';
import { getDateInfo } from '../../common/CommonFunctions';

export default function CompletedMeetingItem({ key, meeting, viewMeeting }) {
  const topic = meeting.name;
  const desc = meeting.description;

  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const date = dateInfo.date;
  const startTime = dateInfo.startTime;
  const endTime = dateInfo.endTime;
  const duration = dateInfo.duration;

  return (
    <Col className="Container__padding--vertical-small">
      <Card bg={'light'} key={key}>
        <Card.Header>
          <Card.Text>Duration: {duration}</Card.Text>
        </Card.Header>
        <Card.Body>
          <Card.Title>{topic}</Card.Title>
          <Card.Subtitle>
            Date: {date} {startTime} - {endTime}
          </Card.Subtitle>
          <Card.Text>Description: {desc}</Card.Text>
          {/*
				<Row className="justify-content-end" xs="auto">
					<Button variant="primary" onClick={viewMeeting}>
						View meeting report
					</Button>
				</Row>
				*/}
        </Card.Body>
      </Card>
    </Col>
  );
}
