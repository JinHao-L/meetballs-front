import { useEffect, useContext } from 'react';
import { Container, Image } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { zoomLogin } from '../../services/auth';
import ImageRedirect from '../../assets/redirecting.jpg';

const CODE_PARAM_KEY = 'code';

export default function ZoomRedirectPage() {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const history = useHistory();
  const query = new URLSearchParams(search);
  const code = query.get(CODE_PARAM_KEY);

  useEffect(() => {
    if (!code) {
      history.push('/login');
      return;
    }
    zoomLogin(code)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(code);
        history.push('/login');
      });
  }, []);

  useEffect(() => {
    if (user) {
      history.push('/home');
    }
  }, [user]);

  return (
    <Container
      style={{
        paddingLeft: 30,
        paddingRight: 30,
        height: 'calc(100vh - 56px)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Image src={ImageRedirect} style={{ width: '100%', maxWidth: 600 }} />
      <p style={{ fontSize: 25, fontWeight: 500 }}>
        Please hold on while we log you in.
      </p>
    </Container>
  );
}
