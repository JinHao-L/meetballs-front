import { Container, Row, Col, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Facebook, Instagram } from 'react-bootstrap-icons';

export default function AppFooter() {
  const history = useHistory();

  return (
    <>
      <div className="Line--horizontal" />
      <Container
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <Facebook
              size={24}
              style={{ color: '8F6B58', cursor: 'pointer' }}
              onClick={() => {
                window.open('https://www.facebook.com/MeetBallsApp/');
              }}
            />
            <div className="Buffer--10px" />
            <Instagram
              size={24}
              style={{ color: '8F6B58', cursor: 'pointer' }}
              onClick={() => {
                window.open('https://www.instagram.com/meetballsapp/');
              }}
            />
            <div className="Buffer--20px" />
            <div className="Line--vertical" />
            <div className="Buffer--20px" />
            <Nav variant="footer">
              <Nav.Link onClick={() => history.push('/documentation')}>
                Documentations
              </Nav.Link>
              <div className="Buffer--20px" />
              <Nav.Link onClick={() => history.push('/support')}>
                Support
              </Nav.Link>
              <div className="Buffer--20px" />
              <Nav.Link onClick={() => history.push('/privacy-policy')}>
                Privacy Policy
              </Nav.Link>
              <div className="Buffer--20px" />
              <Nav.Link onClick={() => history.push('/terms')}>
                Terms {'&'} Conditions
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </>
  );
}
