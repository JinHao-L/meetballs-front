import server from './server';
import { defaultHeaders } from '../utils/axiosConfig';
import setAuthToken from '../utils/setAuthToken';
import { refreshTokenKey } from '../common/CommonValues';

export const login = async (email, password) => {
  try {
    const body = {
      email,
      password,
    };
    const res = await server.post('auth/login', body, defaultHeaders);
    const data = res.data;
    // set token in the axios instance
    setAuthToken(data.access_token || null);
    if (data.expires_in) {
      setTimeout(refresh, data.expires_in * 1000);
    }
    localStorage.setItem(refreshTokenKey, data.refresh_token);
    return true;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const refresh = async () => {
  const refToken = localStorage.getItem(refreshTokenKey);
  if (!refToken) {
    throw Error('No refresh token');
  }
  try {
    const res = await server.post(`auth/refresh`, null, {
      params: {
        refresh_token: refToken,
        grant_type: 'refresh_token',
      },
    });
    const data = res.data;
    setAuthToken(data.access_token || null);
    if (data.expires_in) {
      setTimeout(refresh, data.expires_in * 1000);
    }
    localStorage.setItem(refreshTokenKey, data.refresh_token);
    return true;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
