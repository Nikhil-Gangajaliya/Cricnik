import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:7100/api",
  withCredentials: true,
});

export {api};