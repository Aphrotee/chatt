import Axios from 'axios';

const axios = Axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL
    baseURL: 'http://172.19.126.177:9000/api/v1/'
    // baseURL: 'https://chatt.cyclic.app/api/v1'
});

export default axios;