import './resetPassword.scss';
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios1.js';
import cookies from '../../cookies.js';

const ResetPassword = () => {
    gsap.registerPlugin()
    const user1 = useRef();
    const user2 = useRef();
    const [inputs, setInputs] = useState({});
    const msg = useRef(null);
    const [Msg, setMsg] = useState("");
    const loading = useRef(null);
    const [Loading, setLoading] = useState(false);
    const [resetBtn, setResetBtn] = useState("Reset password")
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
        msg.current.style.color = 'green';
      } else {
        msg.current.style.color = 'red';
      }
      setMsg(message);
    }

    const resetPassword = (event) => {
      event.preventDefault();
      console.log(Loading);
      if (!Loading) {
        const { otp, password, confirm_password } = inputs;

        setMsg("");
        if (!otp) {
          applyMessage("Please enter one-time-password", false)
        } else if (!password) {
          applyMessage("Please enter new password", false)
        } else if (!confirm_password) {
          applyMessage("Please confirm new passowrd", false)
        } else {
          if (password === confirm_password) {
            setLoading(!Loading);
            setResetBtn("In progress...");
            loading.current.style.opacity = 0.6
            loading.current.style.cursor = 'not-allowed';
            const userId = cookies.get('userId');
            axios.put('/auth/reset-password',
            {
              userId, otp, password,
            },
            {
              method: 'put',
              headers: { 'Content-Type': 'application/json' }
            })
              .then((value) => {  
                applyMessage(value.data['message'], true);
                loading.current.style.opacity = 1
                loading.current.style.cursor = 'default';
                setResetBtn("Reset password");
                setTimeout(() => {
                  navigate('/login', { replace: true });
                }, 1000);
              })
              .catch((err) => {
                setLoading(false);
                setResetBtn("Reset password");
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
        <section className="reset-password">
           <div>
            <p>CHATT</p>
            <div ref={user1} className="user user1">What time are you <br/> coming over today?</div>
            <div ref={user2} className="user user2">I'll be right there <br/> after I see my mom off</div>
           </div>

           <div>
           <div className='header'>
            CHATT
            </div>
            <div className='reset-password-box'>
                    <form name="resetPassword" onSubmit={resetPassword}>
                        <div>
                            <p>Reset password</p>
                        </div>
                        <div className='otp'>
                            <ion-icon name="key"></ion-icon>
                            <input type="number" name="otp" placeholder='OTP' value={inputs.otp} onChange={handleChange} /></div>
                        <div className='password'>
                            <ion-icon name="lock-closed"></ion-icon>
                            <input type="password" name="password" placeholder='New Password' value={inputs.password} onChange={handleChange} /></div>
                        <div className='confirm-password'>
                            <ion-icon name="lock-closed"></ion-icon>
                            <input type="password" name="confirm_password" placeholder='Confirm New Password' value={inputs.confirm_password} onChange={handleChange} /></div>
                        <input id="button" ref={loading} type="submit" value={resetBtn} />
                        <p>Check email for otp</p>
                        <p class='message' ref={msg} >{Msg}</p>

                    </form>
            </div>

            <div className='copyright'>Copyright &#x40;Chatt 2023  |  Privacy policy </div>
           </div>
        </section>
    );
};

export default ResetPassword;