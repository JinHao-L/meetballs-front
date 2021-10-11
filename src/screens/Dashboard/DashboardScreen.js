import { useEffect, useState } from 'react';
import {
  Tab,
  Tabs,
  Spinner,
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { CalendarPlusFill } from 'react-bootstrap-icons';
import CompletedMeetingItem from './CompletedMeetingItem';
import UpcomingMeetingItem from './UpcomingMeetingItem';
import { defaultHeaders } from '../../utils/axiosConfig';
import AddMeetingOverlay from './AddMeetingOverlay';
import server from '../../services/server';
import { useHistory } from 'react-router';

function AddMeetingButton({ onClick }) {
  return (
    <div className="Fab" onClick={onClick}>
      <CalendarPlusFill size={22} color="white" />
    </div>
  );
}

export default function DashboardScreen() {
  const [upcoming, setUpcoming] = useState([]);
  const [meetingHistory, setHistory] = useState([]);

  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingPast, setLoadingPast] = useState(true);

  const [showOverlay, setShowOverlay] = useState(false);

  const history = useHistory();

  useEffect(() => {
    return pullMeetings();
  }, []);

  function pullMeetings() {
    pullPastMeetings();
    pullUpcomingMeetings();
  }

  function pullUpcomingMeetings() {
    function sortMeetings(meetingA, meetingB) {
      const startA = meetingA.startedAt;
      const startB = meetingB.startedAt;
      if (startA < startB) return 1;
      else if (startA > startB) return -1;
      else return 0;
    }
    return server
      .get('/meeting', {
        params: { type: 'upcoming' },
        ...defaultHeaders,
      })
      .then((res) => {
        console.log(res);
        const meetings = res.data;
        const upcoming = meetings.sort(sortMeetings);
        setUpcoming(upcoming);
        setHistory(meetingHistory);
      })
      .catch(console.error)
      .finally(() => setLoadingUpcoming(false));
  }

  function pullPastMeetings() {
    function sortMeetings(meetingA, meetingB) {
      const startA = meetingA.startedAt;
      const startB = meetingB.startedAt;
      if (startA > startB) return 1;
      else if (startA < startB) return -1;
      else return 0;
    }
    console.log('Retrieving past meetings');
    return server
      .get('/meeting', {
        params: { type: 'past' },
        ...defaultHeaders,
      })
      .then((res) => {
        console.log(res);
        const pastMeetings = res.data.sort(sortMeetings);
        setHistory(pastMeetings);
      })
      .catch(console.error)
      .finally(() => setLoadingPast(false));
  }

  const upcomingList = upcoming.map((meeting, idx) => {
    return (
      <UpcomingMeetingItem
        key={idx}
        meeting={meeting}
        editMeeting={() => {
          const id = meeting.id;
          console.log('Edit meeting clicked');
          history.push('/meeting/' + id);
        }}
      />
    );
  });

  const historyList = meetingHistory.map((meeting, idx) => {
    return (
      <CompletedMeetingItem
        key={idx}
        meeting={meeting}
        viewMeeting={() => {
          console.log('View meeting report clicked');
        }}
      />
    );
  });

  if (loadingUpcoming) {
    return (
      <>
        <Container className="Container__padding--vertical">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  function logout() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    history.replace('/login');
  }

  return (
    <>
      <Container className="Container__padding--vertical">
        <Row>
          <Col sm={12} md={12} lg={3}></Col>
          <Col sm={12} md={12} lg={6}>
            <div className="d-grid gap-2">
              <Button onClick={logout}>Logout</Button>
            </div>
            <div className="Buffer--20px" />
            <Tabs
              className="Container__padding--horizontal"
              defaultActiveKey="upcoming"
              transition={false}
              id="meetings-tabs"
            >
              <Tab eventKey="upcoming" title="Upcoming Meetings">
                <div className="Container__padding--vertical">
                  {upcomingList}
                </div>
              </Tab>
              <Tab eventKey="past" title="Past Meetings">
                {historyList}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
      <AddMeetingOverlay
        show={showOverlay}
        setShow={setShowOverlay}
        onUpdate={pullMeetings}
      />
      <AddMeetingButton onClick={() => setShowOverlay(true)} />
    </>
  );
}
