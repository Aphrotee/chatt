import './login.scss';
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import base64 from 'base-64';
import axios from '../../axios.js';
import cookies from '../../cookies.js';

const Login = () => {
    gsap.registerPlugin()
    const user1 = useRef()
    const user2 = useRef()
    const msg = useRef(null);
    const loading = useRef(null);
    const [Msg, setMsg] = useState("");
    const [inputs, setInputs] = useState({});
    const [Loading, setLoading] = useState(false);
    const [loginBtn, setLoginBtn] = useState("Login")
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(user1, {opacity: 0}, {opacity: 1, duration: 3})
    });

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({ ...values, [name]: value }));
    }

    const applyMessage = (message, success) => {
      if (success) {
        setMsg("");
      } else {
        msg.current.style.color = 'red';
      }
      setMsg(message);
    }
    const loginUser = (event) => {
      event.preventDefault();
      console.log(Loading);
      if (!Loading) {
        const { email, password } = inputs;

        setMsg("");
        if (!email) {
          applyMessage("Please enter email", false)
        } else if (!password) {
          applyMessage("Please enter password", false)
        } else {
          console.log(email, password);
          setLoading(!Loading);
          setLoginBtn("Logging in...");
          loading.current.style.opacity = 0.6
          loading.current.style.cursor = 'not-allowed';
          const auth = base64.encode(`${email}:${password}`);
          console.log(auth);
          const authorization = `Bearer ${auth}`;
          axios({
            url: '/auth/login',
            method: 'get',
            headers: { 'Authorization': authorization }
          })
            .then((value) => {
              applyMessage(``, true);
              loading.current.style.opacity = 1
              loading.current.style.cursor = 'default';
              setLoginBtn("Login successful");
              cookies.set('X-Token', value.data['token']);
              cookies.set('chatt_userId', value.data['userId']);
              cookies.set('chatt_username', value.data['username']);
              navigate('/messages', { replace: true });
            })
            .catch((err) => {
              setLoading(false);
              setLoginBtn("Login");
              loading.current.style.opacity = 1
              loading.current.style.cursor = 'pointer';
              if (err.response.status === 500) {
                console.log(err.response.data);
                applyMessage('Network error, please try again later', false);
              } else {
                applyMessage(`${err.response.data['error']}`, false);
              }
            });

        }
      }
    }

    const forgotPassword = (event) => {
      event.preventDefault();
      if (!Loading) {
        const { email } = inputs;

        setMsg("");
        if (!email) {
          applyMessage("Please enter email", false);
        } else {
          setLoading(!Loading);
          loading.current.style.opacity = 0.6
          loading.current.style.cursor = 'not-allowed';
          axios.post('/auth/send-otp',
          {
            email
          },
          {
            method: 'post',
            headers: { 'Content-Type': 'application/json' }
          })
            .then((value) => {
              loading.current.style.opacity = 1
              loading.current.style.cursor = 'default';
              const userId = value.data['userId'];
              cookies.set('userId', userId);
              setTimeout(() => {
                navigate('/reset-password', { replace: true });
              }, 2000);
            })
            .catch((err) => {
              setLoading(false);
              loading.current.style.opacity = 1
              loading.current.style.cursor = 'pointer';
              if (err.response.status === 500) {
                console.log(err.response.data);
                applyMessage('Network error, please try again later', false);
              } else {
                applyMessage(`${err.response.data['error']}`, false);
              }
            });
        }
      }

    }


    return (
        <section className="login">
           <div>
            <p>CHATT</p>
           </div>

           <div>

           <div className='header'>
            CHATT
            </div>
            <div className='login-box'>
                    <form name="loginForm" onSubmit={loginUser}>
                        <div>
                            <p>Welcome Back</p>
                            <p>Enter your details to resume connecting with friends and loved ones</p>
                        </div>
                        <div className='email'>
                            <ion-icon name="mail"></ion-icon>
                            <input type="email" name="email" placeholder='Email' value={inputs.email} onChange={handleChange} /></div>
                        <div className='password'>
                            <ion-icon name="lock-closed"></ion-icon>
                            <input type="password" name="password" placeholder='Password' value={inputs.password} onChange={handleChange} /></div>
                        <input id="button" ref={loading} type="submit" value={loginBtn} />
                        <p class='message' ref={msg}>{Msg}</p>

                        <p>Don't have an account? <u className="other-options" onClick={() => {navigate('/signup')}} > Sign Up</u></p>
                        <p><u className="other-options" onClick={forgotPassword}>Forgot Password?</u></p>
                    </form>
            </div>

            <div className='copyright'>Copyright &#x40;Chatt 2023  |  Privacy policy </div>
           </div>

        </section>
    );
};

export default Login;