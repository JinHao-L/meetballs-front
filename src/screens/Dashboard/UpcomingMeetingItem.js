import { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { getDateInfo, openLinkInNewTab } from '../../common/CommonFunctions';
import { useHistory } from 'react-router';
import ConfirmDeleteModel from './ConfirmDeleteModel';
import server from '../../services/server';
import PropTypes from 'prop-types';
import { Trash, CameraVideo, Pen } from 'react-bootstrap-icons';

export default function UpcomingMeetingItem({ meeting, pullMeeting }) {
  const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
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
      <div style={{ height: 210 }}>
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
      </div>
    );
  }

  function Toggles() {
    return (
      <Row>
        <Col onClick={startMeeting} className="Toggle-card">
          <CameraVideo />
          Start
        </Col>
        <Col onClick={editMeeting} className="Toggle-card">
          <Pen />
          Edit
        </Col>
        <Col onClick={() => setShowConfirmDelete(true)} className="Toggle-card">
          <Trash />
          Delete
        </Col>
      </Row>
    );
  }

  return (
    <Col lg={4} md={6} sm={12} className="Container__padding--vertical-small">
      <Card style={{ height: 300 }}>
        <Card.Body>
          <Details />
          <div className="Line--horizontal" />
          <div className="Buffer--5px" />
          <Toggles />
        </Card.Body>
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
