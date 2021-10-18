import { Container, Image } from 'react-bootstrap';

export const MEETING_NOT_FOUND_ERR = 'The meeting requested was not found!';
export const LOADING_MSG = 'Please hold on while we verify your link.';
export const ERROR_MSG =
  'Error! Your link is invalid! Please contact your meeting host for a new link.';
export const WAIT_MSG = 'Please hold on while we log you in.';

export default function RedirectionScreen({ message }) {
  const containerStyle = {
    paddingLeft: 30,
    paddingRight: 30,
    height: 'calc(100vh - 56px)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  };

  function image() {
    switch (message) {
      case ERROR_MSG:
      case MEETING_NOT_FOUND_ERR:
        return require('../assets/error.jpg').default;
      default:
        return require('../assets/redirecting.jpg').default;
    }
  }

  return (
    <Container style={containerStyle}>
      <Image src={image()} style={{ width: '100%', maxWidth: 600 }} />
      <p style={{ fontSize: 25, fontWeight: 400 }}>{message}</p>
    </Container>
  );
}
