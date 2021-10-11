import { Container, Navbar, Image, Button, Row, Col } from 'react-bootstrap';
import Logo from '../../assets/logo.png';
import { Facebook } from 'react-bootstrap-icons';
import LandingImage from '../../assets/landing_image.png';
import { AppNavbar } from '../../components/AppNavbar';

export default function LandingScreen() {
  return (
    <Container fluid>
      <AppNavbar />
      <Container fluid className="Container__content">
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
