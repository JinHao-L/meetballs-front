import { useState, useEffect } from 'react';
import { getFormattedDateTime } from '../../common/CommonFunctions';
import { blankMeeting } from '../../common/ObjectTemplates';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router';
import BackgroundPattern from '../../assets/background_pattern2.jpg';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import RedirectionScreen, { MEETING_NOT_FOUND_ERR } from '../../components/RedirectionScreen';

const JOINER_KEY = 'joiner';

export default function ParticipantScreen() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(blankMeeting);
  const [validId, setValidId] = useState(true);
  const [loading, setLoading] = useState(false);
  const [restrictDescription, setRestrictDescription] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const joinerId = params.get(JOINER_KEY);

  useEffect(() => {
    if (!joinerId) {
      setValidId(false);
      setLoading(false);
      return;
    }

    return pullMeeting()
      .then(() => setValidId(true))
      .catch((_) => setValidId(false))
      .finally(() => setLoading(false));
  }, []);

  async function pullMeeting() {
    const response = await server.get(`/meeting/${id}`, defaultHeaders);
    if (response.status !== 200) return;
    const result = response.data;
    setMeeting(result);
  }

  if (!loading && !validId) return <RedirectionScreen message={MEETING_NOT_FOUND_ERR} />;

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
            <p className="Text__header">{meeting.name}</p>
            <p className="Text__subheader">
              {getFormattedDateTime(meeting.startedAt)}
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
              {meeting.description}
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
            <p className="Text__subheader">Your Agenda Items</p>
            <Row>
              <Col
                lg={6}
                md={12}
                sm={12}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                className="Container__padding--vertical-small"
              >
                <Card>
                  <Card.Body>Content</Card.Body>
                </Card>
              </Col>
              <Col
                lg={6}
                md={12}
                sm={12}
                style={{ paddingLeft: 10, paddingRight: 10 }}
                className="Container__padding--vertical-small"
              >
                <Card>
                  <Card.Body>Content</Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="Buffer--50px" />
      </Container>
      <div className="Buffer--50px" />
    </div>
  );
}
