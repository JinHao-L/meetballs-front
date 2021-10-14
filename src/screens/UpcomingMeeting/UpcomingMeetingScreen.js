import { useState, useEffect } from 'react';
import { Button, Row, Col, Container, Nav } from 'react-bootstrap';
import {
  getFormattedDateTime,
  openLinkInNewTab,
} from '../../common/CommonFunctions';
import AgendaItemList from './AgendaItemList';
import ParticipantItemList from './ParticipantItemList';
import { PersonPlusFill, CalendarPlusFill } from 'react-bootstrap-icons';
import {
  blankAgenda,
  blankMeeting,
  blankParticipant,
} from '../../common/ObjectTemplates';
import { apiUrl } from '../../common/CommonValues';
import EditMeetingOverlay from './EditMeetingOverlay';
import { useHistory, Redirect, useParams } from 'react-router';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';

export default function UpcomingMeetingScreen() {
  const [meeting, setMeeting] = useState(blankMeeting);
  const [restrictDescription, setRestrictDescription] = useState(true);
  const [currentTab, setCurrentTab] = useState('participants');
  const [showEditMeeting, setShowEditMeeting] = useState(false);
  const [isReordering, setReordering] = useState(false);
  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    pullMeeting();
  }, []);

  async function pullMeeting() {
    const response = await server.get(`/meeting/${id}`, defaultHeaders);
    const result = response.data;
    if (response.status !== 200) return;
    if (result.agendaItems && result.agendaItems.length > 1) {
      result.agendaItems.sort((p1, p2) => {
        return p1.position - p2.position;
      });
      result.agendaItems.forEach((item) => {
        item.prevPosition = item.position;
      });
    }
    setMeeting(result);
  }

  function startZoom() {
    openLinkInNewTab(meeting.joinUrl);
    history.replace('/ongoing/' + id);
  }

  function Content() {
    if (currentTab === 'agenda') {
      return (
        <AgendaItemList
          meeting={meeting}
          setMeeting={setMeeting}
          isReordering={isReordering}
          setReordering={setReordering}
        />
      );
    } else {
      return <ParticipantItemList meeting={meeting} setMeeting={setMeeting} />;
    }
  }

  function AddToggle() {
    if (currentTab === 'participants') {
      return (
        <div
          className="Fab"
          onClick={() => addParticipant(meeting, setMeeting)}
        >
          <PersonPlusFill size={25} color="white" />
        </div>
      );
    }
    return (
      <div className="Fab" onClick={() => addAgenda(meeting, setMeeting)}>
        <CalendarPlusFill size={22} color="white" />
      </div>
    );
  }

  if (meeting.type !== undefined && meeting.type !== 1) {
    return <Redirect to={'/ongoing/' + id} />;
  }

  return (
    <>
      <Container className="Container__padding--vertical">
        <Row>
          <Col
            lg={4}
            md={12}
            sm={12}
            className="Container__padding--horizontal"
          >
            <p className="Text__header">{meeting.name}</p>
            <p className="Text__subheader">
              {getFormattedDateTime(meeting.startedAt)}
            </p>
            <div className="d-grid gap-2">
              <Button onClick={startZoom}>Start Zoom Meeting</Button>
              <Button variant="outline-primary">Email Participants</Button>
              <Button
                variant="outline-primary"
                onClick={() => setShowEditMeeting(true)}
              >
                Edit / Delete Meeting
              </Button>
            </div>
            <div className="Container__row--space-between">
              <p className="Text__subsubheader">Description</p>
              <a
                className="Text__toggle"
                onClick={() => setRestrictDescription(!restrictDescription)}
              >
                {restrictDescription ? 'Show More' : 'Show Less'}
              </a>
            </div>
            <p
              className={
                'Text__paragraph' +
                (restrictDescription ? ' Text__elipsized--5-lines' : '')
              }
            >
              {meeting.description}
            </p>
            <div className="Buffer--20px" />
          </Col>
          <Col lg={1} md={12} sm={12} />
          <Col lg={6} md={12} sm={12}>
            <Nav
              variant="tabs"
              defaultActiveKey="participants"
              onSelect={(selectedKey) => setCurrentTab(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="participants">Participants</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="agenda">Agenda</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="Buffer--20px" />
            <div className="Container__padding--horizontal">
              <Content />
            </div>
            <div className="Buffer--100px" />
          </Col>
        </Row>
      </Container>
      <EditMeetingOverlay
        show={showEditMeeting}
        setShow={setShowEditMeeting}
        meeting={meeting}
        setMeeting={setMeeting}
      />
      <AddToggle />
    </>
  );
}

function addParticipant(meeting, setMeeting) {
  if (meeting.participants.findIndex((item) => item.userEmail === '') >= 0)
    return;
  const newMeeting = Object.assign({}, meeting);
  const newParticipant = Object.assign({}, blankParticipant);
  newParticipant.meetingId = newMeeting.id;
  newMeeting.participants = [...newMeeting.participants, newParticipant];
  setMeeting(newMeeting);
}

async function addAgenda(meeting, setMeeting) {
  const newMeeting = Object.assign({}, meeting);
  const newAgenda = Object.assign({}, blankAgenda);
  newAgenda.meetingId = newMeeting.id;
  const size = newMeeting.agendaItems.length;
  if (size > 0) {
    const lastItem = newMeeting.agendaItems[size - 1];
    newAgenda.position = lastItem.position + 1;
  } else {
    newAgenda.position = 0;
  }
  newAgenda.prevPosition = newAgenda.position;
  await addAgendaToDatabase(newAgenda);
  newMeeting.agendaItems = [...newMeeting.agendaItems, newAgenda];
  setMeeting(newMeeting);
}

async function addAgendaToDatabase(newAgenda) {
  await server.post(
    '/agenda-item',
    {
      meetingId: newAgenda.meetingId,
      position: newAgenda.position,
      name: newAgenda.name,
      description: newAgenda.description,
      expectedDuration: newAgenda.expectedDuration,
    },
    defaultHeaders,
  );
}
