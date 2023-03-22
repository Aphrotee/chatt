import './signup.scss';
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios1.js';

const Signup = () => {
    gsap.registerPlugin()
    const user1 = useRef()
    const user2 = useRef()

    useEffect(() => {
        gsap.fromTo(user1, {opacity: 0}, {opacity: 1, duration: 3})
    });

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({ ...values, [name]: value }));
    }

    const msg = useRef(null);
    const [Msg, setMsg] = useState("");
    const loading = useRef(null);
    const [Loading, setLoading] = useState(false);
    const [signupBtn, setSignupBtn] = useState("Sign up")
    const navigate = useNavigate();

    const applyMessage = (message, success) => {
      if (success) {
        msg.current.style.color = 'green';
      } else {
        msg.current.style.color = 'red';
      }
      setMsg(message);
    }
    const registerUser = (event) => {
      event.preventDefault();
      console.log(Loading);
      if (!Loading) {
        const { email, username, password, confirm_password } = inputs;

        setMsg("");
        if (!email) {
          applyMessage("Please enter email", false)
        } else if (!username) {
          applyMessage("Please enter username", false)
        } else if (!password) {
          applyMessage("Please enter password", false)
        } else if (!confirm_password) {
          applyMessage("Please confirm passowrd", false)
        } else {
          if (password === confirm_password) {
            setLoading(!Loading);
            setSignupBtn("Signing up...");
            loading.current.style.opacity = 0.6
            loading.current.style.cursor = 'not-allowed';
            axios.post('/auth/register',
            {
              email, username, password,
            },
            {
              method: 'post',
              headers: { 'Content-Type': 'application/json' }
            })
              .then((value) => {  
                applyMessage(`Welcome ${value.data.username}`, true);
                loading.current.style.opacity = 1
                loading.current.style.cursor = 'default';
                setSignupBtn("Sign up successful");
                setTimeout(() => {
                  navigate('/login', { replace: true });
                }, 1000);
              })
              .catch((err) => {
                setLoading(false);
                setSignupBtn("Sign up");
                loading.current.style.opacity = 1
                loading.current.style.cursor = 'pointer';
                applyMessage(`${err.response.data['error']}`, false);
              });
          } else {
            applyMessage("Password mismatch", false);
          }
        }
      }
    }

    return (
        <section className="signup">
           <div>
            <p>CHATT</p>
            <div ref={user1} className="user user1">What time are you <br/> coming over today?</div>
            <div ref={user2} className="user user2">I'll be right there <br/> after I see my mom off</div>
           </div>

           <div>
           <div className='header'>
            CHATT
            </div>
            <div className='signup-box'>
                    <form name="signupForm" onSubmit={registerUser}>
                        <div>
                            <p>Sign up</p>
                        </div>
                        <div className='email'>
                            <ion-icon name="mail"></ion-icon>
                            <input type="email" name="email" placeholder='Email' value={inputs.email} onChange={handleChange} /></div>
                        <div className='username'>
                            <ion-icon name="person"></ion-icon>
                            <input type="text" name="username" placeholder='Username' value={inputs.username} onChange={handleChange} /></div>
                        <div className='password'>
                            <ion-icon name="lock-closed"></ion-icon>
                            <input type="password" name="password" placeholder='Password' value={inputs.password} onChange={handleChange} /></div>
                        <div className='confirm-password'>
                            <ion-icon name="lock-closed"></ion-icon>
                            <input type="password" name="confirm_password" placeholder='Confirm Password' value={inputs.confirm_password} onChange={handleChange} /></div>
                        <input id="button" ref={loading} type="submit" value={signupBtn} />
                        <p class='message' ref={msg} >{Msg}</p>

                    </form>
            </div>

            <div className='copyright'>Copyright &#x40;Chatt 2023  |  Privacy policy </div>
           </div>
        </section>
    );
};

export default Signup;