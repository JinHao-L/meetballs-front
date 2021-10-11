import axios from 'axios';
import { apiUrl } from '../common/CommonValues';

// https://github.com/axios/axios#config-defaults
const server = axios.create({
  baseURL: apiUrl,
});

export default server;
