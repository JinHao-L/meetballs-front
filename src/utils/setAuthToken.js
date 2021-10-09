import server from '../services/server';
import { accessTokenKey } from '../common/CommonValues';

const setAuthToken = (token) => {
  if (token) {
    server.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    window.sessionStorage.setItem(accessTokenKey, token);
  } else {
    delete server.defaults.headers.common['Authorization'];
    window.sessionStorage.removeItem(accessTokenKey);
  }
};

export default setAuthToken;
