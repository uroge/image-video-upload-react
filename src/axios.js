import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://image-video-react-default-rtdb.firebaseio.com/'
});

export default axiosInstance;