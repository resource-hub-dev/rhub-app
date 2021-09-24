import axios from 'axios';
import config from './config';

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
});

export default api;
