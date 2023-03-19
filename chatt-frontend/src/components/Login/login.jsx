import './login.scss';
import gsap from 'gsap'
import { useEffect, useRef } from 'react';

const Login = () => {
    gsap.registerPlugin()
    const user1 = useRef()
    const user2 = useRef()

    useEffect(() => {
        gsap.fromTo(user1, {opacity: 0}, {opacity: 1, duration: 3})
    })

    return (
        <section className="login">
           <div>
            <p>CHATT</p>
            <div ref={user1} className="user user1">What time are you <br/> coming over today</div>
            <div ref={user2} className="user user2">I'll be right there <br/> after i see my mom off</div>
           </div>

           <div>
           <div className='header'>
            CHATT
            </div>
            <div className='login-box'>
                    <form action="" method="post">
                        <div>
                            <p>Welcome Back</p>
                            <p>Enter your details to resume connecting with friends and loved ones</p>
                        </div>
                        <div className='email'>
                            <ion-icon name="mail"></ion-icon>
                            <input type="email" name="email" id="email"placeholder='Email' /></div>
                        <div className='password'>
                            <ion-icon name="lock-closed"></ion-icon>
                            <input type="password" name="password" id="password" placeholder='Password'/></div>
                        <button type="submit">Log In</button>

                        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                    </form>
            </div>

            <div className='copyright'>Copyright &#x40;Chatt 2022  |  Privacy policy </div>
           </div>

        </section>
    );
};

export default Login;