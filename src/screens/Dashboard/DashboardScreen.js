import { useEffect, useState } from 'react';
import { Tab, Tabs, Container, Row, Col, Button } from 'react-bootstrap';
import { CalendarPlusFill } from 'react-bootstrap-icons';
import CompletedMeetingItem from './CompletedMeetingItem';
import UpcomingMeetingItem from './UpcomingMeetingItem';
import { defaultHeaders } from '../../utils/axiosConfig';
import AddMeetingOverlay from './AddMeetingOverlay';
import server from '../../services/server';
import { useHistory } from 'react-router';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import { AppNavbar } from '../../components/AppNavbar';

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
      if (startA > startB) return 1;
      else if (startA < startB) return -1;
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
      })
      .catch(console.error)
      .finally(() => setLoadingUpcoming(false));
  }

  function pullPastMeetings() {
    function sortMeetings(meetingA, meetingB) {
      const startA = meetingA.startedAt;
      const startB = meetingB.startedAt;
      if (startA < startB) return 1;
      else if (startA > startB) return -1;
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

  const upcomingList = upcoming
    .map((meeting, idx) => 
      <UpcomingMeetingItem key={idx} meeting={meeting} onDelete={pullMeetings}/>
    );

  const historyList = meetingHistory
    .map((meeting, idx) => <CompletedMeetingItem key={idx} meeting={meeting} />);

  if (loadingUpcoming || loadingPast) {
    return <FullLoadingIndicator />;
  }

  return (
    <>
      <AppNavbar buttonType={'logout'} />
      <Container className="Container__padding--vertical Container__content">
        <Row>
          <Col sm={12} md={12} lg={3}></Col>
          <Col sm={12} md={12} lg={6}>
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
                <div className="Container__padding--vertical">
                  {historyList}
                </div>
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
