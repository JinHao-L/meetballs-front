import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { blankMeeting } from '../../common/ObjectTemplates';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import server from '../../services/server';
import AttendanceList from './AttendanceList';
import CompletedAgendaCard from './CompletedAgendaCard';
import { Col, Nav, Row, Button, Container } from "react-bootstrap";
import { getDateInfo, getFormattedDate, getFormattedDateTime } from '../../common/CommonFunctions';

export default function CompletedMeetingScreen() {
  const [meeting, setMeeting] = useState(blankMeeting);
  const [loading, setLoading] = useState(true);
  const [restrictDescription, setRestrictDescription] = useState(false);
  const [currentTab, setCurrentTab] = useState('participants');

  const { id } = useParams();

  useEffect(() => {
    return server
      .get(`/meeting/${id}`)
      .then((res) => setMeeting(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullLoadingIndicator />;

  const type = meeting.type;
  if (type === 0) {
    console.log('Meeting has not started yet');
    return <Redirect to={`/meeting/${id}`} />;
  } else if (type === 1 || type === 2) {
    console.log('Meeting is ongoing');
    return <Redirect to={`/ongoing/${id}`} />;
  }

  function Content() {
    if (currentTab == 'agenda') {
      return meeting.agendaItems.map((item, idx) => (
        <CompletedAgendaCard agendaItem={item} key={idx} />
      ));
    } else {
      const date = meeting.startedAt;
      return <AttendanceList participants={meeting.participants} date={date}/>;
    }
  }

  function NavBar() {
    return (
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
    );
  }

  const startTime = meeting.startedAt;
  const { endTime } = getDateInfo(startTime, meeting.duration);
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
              {getFormattedDateTime(meeting.startedAt)} - {endTime}
            </p>
            <div className="d-grid gap-2">
              <Button>Get Meeting Recording</Button>
              <Button variant="outline-primary">Email Minutes</Button>
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
          <NavBar />
        </Row>
      </Container>
    </>
  );
}
