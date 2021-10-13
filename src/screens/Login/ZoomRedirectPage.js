import { useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { zoomLogin } from '../../services/auth';

const PARAM_KEY = 'code';

export default function ZoomRedirectPage() {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const history = useHistory();
  const query = new URLSearchParams(search);
  const code = query.get(PARAM_KEY);

  useEffect(() => {
    if (!code) {
      history.push('/login-zoom');
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
  }, [user])

  return (
    <Container>
      <div>Checking authorization...</div>
    </Container>
  );
}
