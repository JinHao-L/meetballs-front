import axios from 'axios';
import { openLinkInNewTab } from '../common/CommonFunctions';
import { zoomAuthHeader, zoomId } from '../common/CommonValues';
import { storeToken } from './auth';

const zoomUrl = 'https://zoom.us';

const zoomAuth = axios.create({
  baseURL: zoomUrl,
});
zoomAuth.defaults.headers.common['Authorization'] = `Basic ${zoomAuthHeader}`;
zoomAuth.defaults.headers.common['Content-Type'] =
  'application/x-www-form-urlencoded';

export default zoomAuth;

function authorize(redirectUrl) {
  const responseType = 'code';
  const client = zoomId;
  openLinkInNewTab(
    `${zoomUrl}/oauth/authorize?` +
      `response_type=${responseType}&` +
      `client_id=${client}&` +
      `redirect_uri=${redirectUrl}`,
  );
}

async function requestToken(authCode, redirectUrl) {
  try {
    const body = {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUrl,
    };
    const result = await zoomAuth.post('/oauth/token', body);
    const data = result.data;
    storeToken(data);
    console.log('Successfully retrieved Zoom OAuth token!');
    return true;
  } catch (error) {
    console.error(error);
  }
}
