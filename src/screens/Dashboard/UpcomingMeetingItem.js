import { Card, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getDateInfo, openLinkInNewTab } from '../../common/CommonFunctions';

export default function UpcomingMeetingItem({ key, meeting, editMeeting }) {
  const topic = meeting.name;
  const desc = meeting.description;
  const startUrl = meeting.startUrl;

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

          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={editMeeting}>
              Edit meeting
            </Button>
          </div>

          {/*
					<Button
						variant="primary"
						onClick={() => openLinkInNewTab(startUrl)}
					>
						Start meeting
					</Button>
					*/}
        </Card.Body>
      </Card>
    </Col>
  );
}

UpcomingMeetingItem.propTypes = {
  key: PropTypes.number.isRequired,
  meeting: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    start_url: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  editMeeting: PropTypes.func.isRequired,
};
