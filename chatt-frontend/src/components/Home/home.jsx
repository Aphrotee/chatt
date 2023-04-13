import { useNavigate } from 'react-router-dom';
import cookies from '../../cookies.js';
import Messages from '../Messages/messsages.jsx';
import Login from '../Login/login.jsx';
import { useEffect } from 'react';


const Home = () => {
    const cookie = cookies.get('X-Token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookie || cookie === null || cookie === '' || cookie === undefined) {
            navigate('/login');
        } else {
            navigate('/messages');
        }
    }, []);
}

export default Home;