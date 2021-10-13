export const apiUrl = process.env.REACT_APP_API_URL;
export const accessTokenKey = process.env.REACT_APP_ACCESS_TOKEN_KEY;
export const refreshTokenKey = process.env.REACT_APP_REFRESH_TOKEN_KEY;

export const zoomId = process.env.REACT_APP_ZOOM_OAUTH_CLIENT_ID;
const zoomSecret = process.env.REACT_APP_ZOOM_OAUTH_CLIENT_SECRET;
export const zoomAuthHeader = Buffer.from(`${zoomId}:${zoomSecret}`).toString(
  'base64',
);
