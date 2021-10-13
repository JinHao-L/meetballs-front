import { useState } from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { getDateInfo, openLinkInNewTab } from '../../common/CommonFunctions';
import { useHistory } from 'react-router';
import ConfirmDeleteModel from './ConfirmDeleteModel';
import server from '../../services/server';
import PropTypes from 'prop-types';

export default function UpcomingMeetingItem({ meeting, pullMeeting }) {
  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
  const [hovering, setHovering] = useState(false);
  const history = useHistory();
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  function editMeeting() {
    console.log(`Editing meeting of ID = ${meeting.id}`);
    history.push(`/meeting/${meeting.id}`);
  }

  function startMeeting() {
    console.log(`Starting meeting of ID = ${meeting.id}`);
    openLinkInNewTab(meeting.startUrl);
    history.push(`/ongoing/${meeting.id}`);
  }

  function deleteMeeting() {
    if (deleting) return;
    setDeleting(true);
    return server
      .delete(`/meeting/${meeting.id}`)
      .then((_) => {
        pullMeeting();
        history.push('/home');
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setDeleting(false));
  }

  function Details() {
    return (
      <Card.Body>
        <Card.Title className="Text__elipsized--1-line">
          {meeting.name}
        </Card.Title>
        <div className="Buffer--10px" />
        <Card.Subtitle className="Text__elipsized--1-line">
          {dateInfo.date} {dateInfo.startTime} - {dateInfo.endTime}
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
          <Button variant="primary" onClick={startMeeting}>
            Start Meeting
          </Button>
          <div className="Buffer--10px" />
          <div className="Line--horizontal" />
          <div className="Buffer--10px" />
          <Button variant="outline-primary" onClick={editMeeting}>
            Edit Meeting
          </Button>
          <div className="Buffer--10px" />
          <div className="Line--horizontal" />
          <div className="Buffer--10px" />
          <Button
            variant="outline-primary"
            onClick={() => setShowConfirmDelete(true)}
          >
            {deleting ? 'Deleting' : 'Delete Meeting'}
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
        style={{ height: 230 }}
      >
        {hovering ? Toggles() : Details()}
      </Card>
      <ConfirmDeleteModel
        showModal={showConfirmDelete}
        setShowModal={setShowConfirmDelete}
        meeting={meeting}
        deleteMeeting={deleteMeeting}
      />
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
  pullMeeting: PropTypes.func.isRequired,
};
