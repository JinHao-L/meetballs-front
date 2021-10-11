import { Container, Navbar, Image, Button, Row, Col } from 'react-bootstrap';
import Logo from '../../assets/logo.png';
import { Facebook } from 'react-bootstrap-icons';
import LandingImage from '../../assets/landing_image.png';
import { useHistory } from 'react-router';

export default function LandingScreen() {
  const history = useHistory();

  return (
    <Container fluid>
      <Navbar bg="light" expand="lg" className="Container__fixed-header">
        <Container>
          <Navbar.Brand style={{ alignItems: 'center' }}>
            <Image src={Logo} style={{ width: 30, height: 30 }} />
            <Navbar.Text className="Text__logo">Meetballs</Navbar.Text>
          </Navbar.Brand>
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderRadius: 50 }}
            onClick={() => history.push('/login')}
          >
            Login
          </Button>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col sm={12} md={12} lg={6}>
            <Container
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div className="Buffer--100px" />
              <div>
                <p className="Text__header">Get the Ball Rolling</p>
                <p className="Text__subheader">
                  Plan, track {'&'} analyse your meetings on Meetballs{' '}
                </p>
                <p>• Keep track of attendance</p>
                <p>• Pace your meetings with intelligent agenda</p>
                <p>• Mass email participants (Coming Soon)</p>
                <p>• Save audio transcripts from zoom (Coming Soon)</p>
                <div className="Buffer--20px" />
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    window.open('https://www.facebook.com/MeetBallsApp/');
                  }}
                >
                  <Facebook size={23} style={{ marginRight: 10 }} />
                  Find Us On Facebook
                </Button>
              </div>
            </Container>
          </Col>
          <Col sm={0} md={0} lg={6} className="d-none d-lg-block">
            <Image src={LandingImage} fluid />
          </Col>
        </Row>
        <div className="Buffer--100px" />
      </Container>
    </Container>
  );
}
