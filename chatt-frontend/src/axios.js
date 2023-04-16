import Axios from 'axios';

const axios = Axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL
    baseURL: 'http://192.168.116.94:9000/api/v1/'
    // baseURL: 'https://chatt.cyclic.app/api/v1'
});

export default axios;
