import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://chatt.up.railway.app/api/v1',
});

export default axios;