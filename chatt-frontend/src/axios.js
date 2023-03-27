import Axios from 'axios';

const axios = Axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL
    baseURL: 'https://chatt.cyclic.app/api/v1'
})

export default axios;