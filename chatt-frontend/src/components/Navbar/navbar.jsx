import { useState, useEffect } from 'react';
import React from 'react';
import './navbar.scss';
import axios from '../../axios'
import cookies from '../../cookies';
import { useSelector, useDispatch} from 'react-redux'
import { profileDisplay } from '../../actions/display';
import { useNavigate } from 'react-router-dom';


function Navbar() {

    // browser cookie
    const cookie = cookies.get('X-Token');
    const [state, setState] = useState(false)
    const visible = () => setState(!state)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profileDisplay)

    // useEffect(() => {
    //     if (!profile) {
    //         setState()
    //     }
    // }, [profile])

    const logout = () => {
        axios.delete('/auth/logout', {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {
            console.log('delete response', response)
            navigate('/login');
            cookies.remove('X-Token');
            cookies.remove('chatt_userId');
            cookies.remove('chatt_username');

        });
    }


    return (
        <nav>
            <div> Chatt </div>
            <div>
                <div onClick={visible}>
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </div>
                <div className={state ? "dropdown": "hidden"}>
                <ul>
                    <li onClick={ () => {dispatch(profileDisplay()); setState(!state)}}>Profile</li>
                    <li onClick={logout}>Log Out</li>
                </ul>
            </div>
            </div>
        </nav>
     );
}

export default Navbar;
