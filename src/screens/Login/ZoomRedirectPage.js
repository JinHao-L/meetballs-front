import { useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { zoomLogin } from '../../services/auth';

const CODE_PARAM_KEY = 'code';
const STATE_PARAM_KEY = 'state';

export default function ZoomRedirectPage() {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const history = useHistory();
  const query = new URLSearchParams(search);
  const code = query.get(CODE_PARAM_KEY);
  const state = query.get(STATE_PARAM_KEY);

  useEffect(() => {
    if (!code || state === 'type=dev') {
      console.log(code);
      history.push('/login-zoom');
      return;
    }
    zoomLogin(code)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        //TODO: error feedback
        history.push('/login-zoom');
      });
  }, []);

  useEffect(() => {
    if (user) {
      history.push('/dashboard');
    }
  }, [user]);

  return (
    <Container>
      <div>Checking authorization...</div>
    </Container>
  );
}
