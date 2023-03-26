import './updatestatusquote.scss';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios.js';
import cookies from '../../cookies';

const UpdateStatusQuote = () => {
    const msg = useRef(null);
    const loading = useRef(null);
    const [Msg, setMsg] = useState("");
    const [inputs, setInputs] = useState({});
    const [Loading, setLoading] = useState(false);
    const [updateBtn, setUpdateBtn] = useState("Update")
    const navigate = useNavigate();


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

    const updateStatus = (event) => {
      event.preventDefault();
      console.log(Loading);
      if (!Loading) {
        const { quote } = inputs;

        setMsg("");
        if (!quote) {
          applyMessage("Please enter status quote", false)
        }  else {
            setLoading(!Loading);
            setUpdateBtn("Updating...");
            loading.current.style.opacity = 0.6
            loading.current.style.cursor = 'not-allowed';
            const userId = cookies.get('userid');
            cookies.remove('userid');
            axios.put('/users/update-status-quote',
            {
              userId, quote
            },
            {
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': import.meta.env.VITE_API_KEY
              }
            })
              .then((value) => {
                loading.current.style.opacity = 1
                loading.current.style.cursor = 'default';
                setUpdateBtn("Update");
                navigate('/login', { replace: true });
              })
              .catch((err) => {
                setLoading(false);
                setUpdateBtn("Update");
                loading.current.style.opacity = 1
                loading.current.style.cursor = 'pointer';
                applyMessage(`${err.response.data['error']}`, false);
              });
        }
      }
    }

    return (
        <section className="updatestatusquote">
           <div>
            <p>CHATT</p>
            <div ref={user1} className="user user1">What time are you <br/> coming over today?</div>
            <div ref={user2} className="user user2">I'll be right there <br/> after I see my mom off</div>
           </div>

           <div>
           <div className='header'>
            CHATT
            </div>
            <div className='updatestatusquote-box'>
                    <form name="updatestatusquoteForm" onSubmit={updateStatus}>
                        <div>
                            <p>Update status quote</p>
                        </div>
                        <div className='quote'>
                            <ion-icon name="letter"></ion-icon>
                            <input type="text" name="quote" placeholder="Hi!, lets connect on Chatt Instant Messaging" value={inputs.quote} onChange={handleChange} /></div>
                        <input id="button" ref={loading} type="submit" value={updateBtn} />
                        <input value="Skip" id="skip" onClick={() => {navigate("/login")}} />
                        <p class='message' ref={msg} >{Msg}</p>
                    </form>
            </div>

            <div className='copyright'>Copyright &#x40;Chatt 2023  |  Privacy policy </div>
           </div>
        </section>
    );
};

export default UpdateStatusQuote;