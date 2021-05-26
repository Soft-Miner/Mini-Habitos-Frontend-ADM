import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mini-habits-dev.herokuapp.com',
});

export default api;
