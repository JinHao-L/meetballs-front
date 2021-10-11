import { Container, Row, Col, Button, Nav, Toast } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { useState, useEffect, useContext, useMemo } from 'react';
import {
  getFormattedDateTime,
  getFormattedTime,
  agendaReviver,
} from '../../common/CommonFunctions';
import AgendaList from './AgendaList';
import { blankMeeting } from '../../common/ObjectTemplates';
import ParticipantList from './ParticipantList';
import {
  getMeeting,
  callStartMeeting,
  callEndMeeting,
  callNextMeeting,
} from '../../services/meeting';
import { useSocket } from '../../hooks/useSocket';
import { UserContext } from '../../context/UserContext';
import { AppNavbar } from '../../components/AppNavbar';

var position = -1;

export default function OngoingMeetingAdminScreen() {
  const [meeting, setMeeting] = useState(blankMeeting);
  const [currentTab, setCurrentTab] = useState('agenda');
  const [time, setTime] = useState(new Date().getTime());
  const { socket } = useSocket(meeting.id);
  const user = useContext(UserContext);
  const { id } = useParams();
  const isHost = useMemo(() => {
    console.log(user);
    return meeting?.hostId === user?.uuid;
  }, [meeting.hostId, user]);
  const history = useHistory();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    pullMeeting();
    setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
  }, []);

  useEffect(() => {
    if (socket && !isHost) {
      socket.on('meetingUpdated', function (data) {
        const newMeeting = JSON.parse(data, agendaReviver);
        updateMeeting({ ...meeting, ...newMeeting });
      });
      socket.on('participantUpdated', function (data) {
        const update = JSON.parse(data);
        setMeeting({
          ...meeting,
          participants: updateParticipants(meeting.participants, update),
        });
      });
      socket.on('agendaUpdated', function (data) {
        console.log('agendaUpdated', data);
        pullMeeting();
      });
      socket.on('userConnected', function (msg) {
        console.log(msg);
      });
    } else {
      socket && socket.removeAllListeners();
    }
  }, [socket, isHost]);

  function startZoom() {
    window.open(meeting.startUrl, '_blank');
  }

  const updateMeeting = (meetingObj) => {
    meetingObj.participants.sort((p1, p2) => {
      return (' ' + p1.userName).localeCompare(p2.userName);
    });
    meetingObj.agendaItems.sort((p1, p2) => {
      return p1.position - p2.position;
    });
    setShowError(meetingObj.agendaItems.length === 0);
    syncMeeting(meetingObj, time);
    setMeeting(meetingObj);
  };

  async function pullMeeting() {
    try {
      const res = await getMeeting(id);
      updateMeeting(res.data);
    } catch (err) {
      history.replace('/');
    }
  }

  updateDelay(meeting.agendaItems, time);

  return (
    <>
      <AppNavbar showButton={false} />
      <Container className="Container__padding--vertical Container__content">
        <Row>
          <Col
            lg={3}
            md={12}
            sm={12}
            className="Container__padding--horizontal"
          >
            <p className="Text__header">{meeting.name}</p>
            <p className="Text__subheader">
              {getFormattedDateTime(meeting.startedAt)}
            </p>
            <div className="d-grid gap-2">
              <Button variant="outline-secondary" onClick={startZoom}>
                Relaunch Zoom
              </Button>
            </div>
            <div className="Buffer--20px" />
            <div className="Line--horizontal" />
            <div className="Buffer--20px" />
            <p>
              {position < meeting.agendaItems.length
                ? 'Estimated End Time:'
                : 'Time Ended:'}
            </p>
            <p className="Text__header">
              {getEndTime(time, meeting.agendaItems)}
            </p>
            <div className="d-grid gap-2">
              {isHost && !showError ? (
                <AgendaToggle
                  agenda={meeting.agendaItems}
                  time={time}
                  id={meeting.id}
                  isHost={isHost}
                />
              ) : (
                <MeetingStatus agenda={meeting.agendaItems} />
              )}
            </div>
            <div className="Buffer--20px" />
            <Toast show={showError}>
              <Toast.Header closeButton={false}>No Agenda Found</Toast.Header>
              <Toast.Body>
                Please add an agenda item to the meeting first before starting.
              </Toast.Body>
              <Toast.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      history.push('/meeting/' + id);
                    }}
                  >
                    Back to Editing
                  </Button>
                </div>
              </Toast.Body>
            </Toast>
          </Col>
          <Col lg={1} md={12} sm={12} />
          <Col
            lg={6}
            md={12}
            sm={12}
            className="Container__padding--horizontal"
          >
            <Nav
              variant="tabs"
              defaultActiveKey="agenda"
              onSelect={(selectedKey) => setCurrentTab(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="agenda">Agenda</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="participants">Participants</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="Buffer--20px" />
            {currentTab === 'agenda' ? (
              <AgendaList
                time={time}
                agenda={meeting.agendaItems}
                position={position}
              />
            ) : (
              <ParticipantList
                meeting={meeting}
                setMeeting={setMeeting}
                position={position}
                shouldShowButton={isHost}
              />
            )}
            <div className="Buffer--100px" />
          </Col>
        </Row>
      </Container>
    </>
  );
}

// Agenda

function AgendaToggle({ time, agenda, id }) {
  if (position < 0) {
    return (
      <Button onClick={() => startMeeting(time, agenda, id)}>
        Start Meeting
      </Button>
    );
  } else if (position < agenda.length) {
    return (
      <Button onClick={() => nextItem(time, agenda, id)}>Next Item</Button>
    );
  } else {
    return <Button disabled>Meeting Ended</Button>;
  }
}

function MeetingStatus({ agenda }) {
  if (position < 0) {
    return <p className="Text__subheader">Meeting Not Started</p>;
  } else if (position < agenda.length) {
    return <p className="Text__subheader">Meeting Ongoing</p>;
  } else {
    return <p className="Text__subheader">Meeting Ended</p>;
  }
}

async function startMeeting(time, agenda, id) {
  if (agenda.length < 1) {
    return;
  }
  try {
    await callStartMeeting(id);
    position++;
    initializeAgenda(time, agenda);
  } catch (err) {
    console.log(err);
  }
}

function initializeAgenda(time, agenda) {
  var lastTiming = time;
  for (let i = 0; i < agenda.length; i++) {
    agenda[i].actualDuration = agenda[i].expectedDuration;
    agenda[i].startTime = lastTiming;
    lastTiming += agenda[i].actualDuration;
  }
}

async function nextItem(time, agenda, id) {
  const apiCall =
    position + 1 < agenda.length ? callNextMeeting : callEndMeeting;
  try {
    await apiCall(id);
    agenda[position].actualDuration = time - agenda[position].startTime;
    position++;
    if (position < agenda.length) {
      agenda[position].startTime = time;
    }
  } catch (err) {
    console.log(err);
  }
}

function updateDelay(agenda, time) {
  if (position < 0 || position >= agenda.length) return;
  const delay = Math.max(
    0,
    time - agenda[position].startTime - agenda[position].actualDuration,
  );
  agenda[position].actualDuration += delay;
  updateAgenda(agenda);
}

function updateAgenda(agenda) {
  for (let i = 0; i < agenda.length; i++) {
    agenda[i].isCurrent = i === position;
  }
  if (position >= agenda.length) return;
  var lastTiming = agenda[position].startTime;
  for (let i = position; i < agenda.length; i++) {
    agenda[i].startTime = lastTiming;
    lastTiming += agenda[i].actualDuration;
  }
}

function syncMeeting(meeting) {
  if (meeting.type === 1) {
    // waiting to start
    return;
  } else if (meeting.type === 2) {
    // started
    const pos = getCurrentPosition(meeting);
    const agenda = meeting.agendaItems;
    var lastTiming = agenda[pos].startTime;
    for (let i = pos; i < agenda.length; i++) {
      agenda[i].startTime = lastTiming;
      agenda[i].actualDuration = agenda[i].expectedDuration;
      lastTiming += agenda[i].actualDuration;
    }
    return;
  } else if (meeting.type === 3) {
    // meeting ended
    position = meeting.agendaItems.length;
    return;
  }
}

function getCurrentPosition(meeting) {
  const agenda = meeting.agendaItems;
  for (let i = 0; i < agenda.length; i++) {
    if (agenda[i].isCurrent) {
      position = i;
      return i;
    }
  }
}

function getEndTime(time, agenda) {
  if (position < 0) {
    var duration = 0;
    agenda.forEach((item) => {
      duration += item.expectedDuration;
    });
    return getFormattedTime(new Date(time + duration));
  } else {
    if (agenda.length === 0) return '';
    var lastAgendaItem = agenda[agenda.length - 1];
    return getFormattedTime(
      new Date(lastAgendaItem.startTime + lastAgendaItem.actualDuration),
    );
  }
}

function updateParticipants(participants, update) {
  return participants.map((ppl) => {
    if (ppl.userEmail === update.userEmail) {
      return update;
    } else {
      return ppl;
    }
  });
}
