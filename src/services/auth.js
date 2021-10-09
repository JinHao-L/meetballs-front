import server from './server';
import { defaultHeaders } from '../utils/axiosConfig';
import setAuthToken from '../utils/setAuthToken';

export const login = async (email, password) => {
  try {
    const body = {
      email,
      password,
    };
    const res = await server.get('auth/login', body, defaultHeaders);
    const data = await res.json();
    // set token in the axios instance
    setAuthToken(data.access_token || null);
    if (data.expires_in) {
      setTimeout(refresh, data.expires_in * 1000);
    }
    localStorage.setItem('ref', data.refresh_token);
    return;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const refresh = () => {
  const refToken = localStorage.getItem('ref');
  console.log(refToken);

  const params = new URLSearchParams({
    refresh_token: refToken,
    grant_type: 'refresh_token',
  });
  try {
    const res = await server.post(`auth/refresh/${params.toString()}`);
    const data = await res.json();
    setAuthToken(data.access_token || null);
    if (data.expires_in) {
      setTimeout(refresh, data.expires_in * 1000);
    }
    localStorage.setItem('ref', data.refresh_token);
    return;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
