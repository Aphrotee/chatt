import { useNavigate } from 'react-router-dom';
import cookies from '../../cookies.js';
import Messages from '../Messages/messsages.jsx';
import Login from '../Login/login.jsx';


const Home = () => {
    const cookie = cookies.get('X-Token');
    const navigate = useNavigate();

    if (!cookie) {
        return (<Login />);
    } else {
        return (<Messages />);
    }
}

export default Home;