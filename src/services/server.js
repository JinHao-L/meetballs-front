import axios from 'axios';

// TODO: Add the deployment one here.
const SERVER_BASE_URL = 'http://localhost:3001';

// https://github.com/axios/axios#config-defaults
const server = axios.create({
  baseURL: SERVER_BASE_URL,
});

export default server;
