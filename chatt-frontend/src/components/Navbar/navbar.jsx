import { useState } from 'react';
import React from 'react';
import './navbar.scss';
import cookies from '../../cookies';
import { useNavigate } from 'react-router-dom';

let profile;

function Navbar() {

    // browser cookie
    const cookie = cookies.get('X-Token');

    const [state, setState] = useState(false)
    const visible = () => setState(!state)
    const navigate = useNavigate();
    const [profileState, setProfileState] = useState(false);

    const logout = () => {
        axios.delete('/auth/logout', {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {
            setUser(response.data);
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
                    <li onClick={() => {setProfileState(true); profile = profileState}}>Profile</li>
                    <li onClick={logout}>Log Out</li>
                </ul>
            </div>
            </div>
        </nav>
     );
}

export { Navbar, profile };