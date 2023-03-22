import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://chatt-p5n7.onrender.com/api/v1',
});

export default axios;