import { Image, Row, Col } from 'react-bootstrap';
import Banner from '../../assets/banner_privacy.jpg';
import AppFooter from '../../components/AppFooter';

export default function SupportPage() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Image
          src={Banner}
          style={{
            height: 300,
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
            Support
          </p>
        </div>
      </div>
      <Row
        className="Container__padding--vertical Container__padding--horizontal"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Col
          sm={12}
          md={12}
          lg={{ span: 6, offset: 3 }}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <div className="Buffer--20px" />
          <p className="Text__header">Got any questions?</p>
          <p className="Text__paragraph">
            MeetBalls is committed to providing you with the finest experience.
          </p>
          <p className="Text__paragraph">
            For any enqueries or feedback regarding MeetBalls, please email us
            at{' '}
            <b>
              <a
                href="mailto:zoommeetballs@gmail.com"
                style={{ textDecoration: 'none' }}
              >
                zoommeetballs@gmail.com
              </a>
            </b>{' '}
            and we will try to get back to you within 3 working days.
          </p>
        </Col>
      </Row>
      <AppFooter />
    </>
  );
}
