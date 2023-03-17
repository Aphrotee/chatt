import { useState } from 'react';
import React from 'react';
import './navbar.scss'

function Navbar() {

    const [state, setState] = useState(false)
    const visible = () => setState(!state)

    return (
        <nav>
            <div> Chatt </div>
            <div>
                <div onClick={visible}>
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </div>
                <div className={state ? "dropdown": "hidden"}>
                <ul>
                    <li>Change Profile</li>
                    <li>Log Out</li>
                </ul>
            </div>
            </div>
        </nav>
     );
}

export default Navbar;