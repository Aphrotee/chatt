import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://127.0.0.1:9000/api/v1',
});

export default axios;