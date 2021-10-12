import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { CalendarPlusFill } from 'react-bootstrap-icons';
import CompletedMeetingItem from './CompletedMeetingItem';
import TempUpcomingMeetingItem from './TempUpcomingMeetingItem';
import { defaultHeaders } from '../../utils/axiosConfig';
import AddMeetingOverlay from './AddMeetingOverlay';
import server from '../../services/server';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import TempCompletedMeetingItem from './TempCompletedMeetingItem';

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

  const upcomingList = upcoming.map((meeting, idx) => (
    <TempUpcomingMeetingItem
      key={idx}
      meeting={meeting}
      pullMeeting={pullMeetings}
    />
  ));

  const historyList = meetingHistory.map((meeting, idx) => (
    <TempCompletedMeetingItem key={idx} meeting={meeting} />
  ));

  if (loadingUpcoming || loadingPast) {
    return <FullLoadingIndicator />;
  }

  return (
    <>
      <Container className="Container__padding--vertical">
        <Row>
          {upcomingList}
          {historyList}
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
