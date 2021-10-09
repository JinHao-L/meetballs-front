import server from '../services/server';
import { accessTokenKey } from '../common/CommonValues';

const setAuthToken = (token) => {
  if (token) {
    server.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    window.sessionStorage.setItem(accessTokenKey, token);
    document.dispatchEvent(new Event(accessTokenKey));
  } else {
    delete server.defaults.headers.common['Authorization'];
    window.sessionStorage.removeItem(accessTokenKey);
    document.dispatchEvent(new Event(accessTokenKey));
  }
};

export default setAuthToken;
