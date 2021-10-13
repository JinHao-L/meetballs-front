import { useEffect, useState } from 'react';
import { Container, Row, Image } from 'react-bootstrap';
import { CalendarPlusFill } from 'react-bootstrap-icons';
import TempUpcomingMeetingItem from './TempUpcomingMeetingItem';
import { defaultHeaders } from '../../utils/axiosConfig';
import AddMeetingOverlay from './AddMeetingOverlay';
import server from '../../services/server';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import TempCompletedMeetingItem from './TempCompletedMeetingItem';

import BannerMorning from '../../assets/banner_morning.jpg';
import BannerAfternoon from '../../assets/banner_afternoon.jpg';
import BannerEvening from '../../assets/banner_evening.jpg';
import BannerNight from '../../assets/banner_night.jpg';

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
    getBanner();
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
      <div style={{ position: 'relative' }}>
        <Image
          src={getBanner()}
          fluid
          style={{
            maxHeight: 300,
            width: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          className="Container__center--vertical"
          style={{
            width: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            alignItems: 'center',
          }}
        >
          <p className="Text__header" style={{ color: 'white' }}>
            Welcome Back!
          </p>
          <p className="Text__paragraph" style={{ color: 'white' }}>
            You have {upcoming.length} upcoming meeting
            {upcoming.length > 1 ? 's' : null}.
          </p>
        </div>
      </div>

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

function getBanner() {
  const time = new Date().getHours();
  if (time < 6) {
    return BannerNight;
  } else if (time < 10) {
    return BannerMorning;
  } else if (time < 16) {
    return BannerAfternoon;
  } else if (time < 20) {
    return BannerEvening;
  } else {
    return BannerNight;
  }
}
