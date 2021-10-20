import { useState, useEffect, useContext } from 'react';
import { getFormattedDateTime } from '../../common/CommonFunctions';
import { blankMeeting } from '../../common/ObjectTemplates';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router';
import BackgroundPattern from '../../assets/background_pattern2.jpg';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { UserContext } from '../../context/UserContext';
import UploadItem from './UploadItem';

export default function ParticipantScreen() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(blankMeeting);
  const [validId, setValidId] = useState(true);
  const [loading, setLoading] = useState(false);
  const [restrictDescription, setRestrictDescription] = useState(true);
  const [agendaItems, setAgendaItems] = useState([]);
  const user = useContext(UserContext);

  console.log(user);

  useEffect(() => {
    return pullMeeting()
      .then(() => {
        setValidId(true);
        obtainRelevantAgendaItems();
      })
      .catch((_) => setValidId(false))
      .finally(() => setLoading(false));
  }, []);

  async function pullMeeting() {
    const response = await server.get(`/meeting/${id}`, defaultHeaders);
    if (response.status !== 200) return;
    const result = response.data;
    setMeeting(result);
  }

  async function obtainRelevantAgendaItems() {
    const items = [];
    meeting.agendaItems.forEach((item) => {
      console.log(item.speaker?.id + ' | ' + user?.uuid);
      if (item.speaker !== null && item.speaker?.id === user?.uuid) {
        items.push(item);
      }
    });
    setAgendaItems(items);
  }

  function UploadItems() {
    const items = [];
    agendaItems.forEach((item) => {
      items.push(<UploadItem agendaItem={item} />);
    });
    return items;
  }

  if (user?.uuid === meeting?.hostId) {
    return <Redirect to={'/meeting/' + id} />;
  }

  return (
    <div
      className="Container__background-image"
      style={{
        backgroundImage: `url(${BackgroundPattern})`,
      }}
    >
      <div className="Buffer--50px" />
      <Container className="Container__padding--vertical Container__foreground">
        <div className="Buffer--50px" />
        <Row>
          <Col lg={1} md={12} sm={12} />
          <Col
            lg={4}
            md={12}
            sm={12}
            style={{ paddingLeft: 30, paddingRight: 30 }}
          >
            <p className="Text__header">Hi {user?.name}!</p>
            <p className="Text__subheader">
              You have a meeting <b>{meeting?.name}</b> scheduled on{' '}
              {getFormattedDateTime(meeting?.startedAt)}.
            </p>
          </Col>
          <Col
            lg={6}
            md={12}
            sm={12}
            style={{ paddingLeft: 30, paddingRight: 30 }}
          >
            <div className="Container__row--space-between">
              <p className="Text__subsubheader">Description</p>
              <div
                className="Text__hint Clickable"
                onClick={() => setRestrictDescription(!restrictDescription)}
              >
                {restrictDescription ? 'Show More' : 'Show Less'}
              </div>
            </div>
            <div className="Buffer--10px" />
            <p
              className={
                'Text__paragraph' +
                (restrictDescription ? ' Text__elipsized--5-lines' : '')
              }
            >
              {meeting?.description}
            </p>
          </Col>
        </Row>
        <div className="Buffer--20px" />
        <div className="Line--horizontal" />
        <div className="Buffer--20px" />
        <Row>
          <Col lg={1} md={12} sm={12} />
          <Col
            lg={10}
            md={12}
            sm={12}
            style={{ paddingLeft: 30, paddingRight: 30 }}
          >
            <p className="Text__subheader">
              Here are the items you will be presenting:
            </p>
            <Row>{UploadItems}</Row>
          </Col>
        </Row>

        <div className="Buffer--50px" />
      </Container>
      <div className="Buffer--50px" />
    </div>
  );
}
