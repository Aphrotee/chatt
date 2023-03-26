import './messages.scss';
import axios from '../../axios'
import cookies from '../../cookies'
import { useState, useRef, useEffect} from 'react'


const Messages = ({ messages, user, other, otherUser, setContainers}) => {

    const [input, setInput] = useState('')
    const scrollbar = useRef(null)
    const cookie = cookies.get('X-Token')

    const sendMessage = async (e) => {
        e.preventDefault()
        const data =  {
            message: input,
            containerId: other.id,
            receiverId: other.otherId[0],
            senderId: user.id,
            type: "text",
        }

        await axios.post('/messages/new', data,
        { headers: {
                        'X-Token': cookie
                    }
                }
        )

        axios.get("containers/all", {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {

        setContainers(response.data)
        })
        setInput("")
    }


    const display = () => {
        if (messages.length === 0 && otherUser === null) {
            return (
            <div ref={scrollbar} className="empty">
                <div>
                    <img src="../../src/images/undraw_modern_life_re_8pdp.svg" alt="" />
                </div>
                <div>
                    <p>Chatt Instant Messaging</p>
                    <p>Send instant messages to friends and loved ones to keep in touch with another</p>
                </div>
            </div>)
        }

        return (
            <>
            <div className="user-nav">

                    <div><img src="../../src/images/profile (1).png" alt="" /></div>
                    <div>
                        <p>{other.name}</p>
                        <p>Last reply at {other.lastSeen}</p>
                    </div>
                    <div>
                        <ion-icon name="call-outline"></ion-icon>
                    </div>
            </div>
            
            <div ref={scrollbar} className='messages'>
            {messages.map((message) => {

            if (Object.keys(message).length !== 0 && user !== undefined) {
            return (
            <div key={message._id} className={message.receiverId !==  user.id ? 'current-user-wrapper': 'other-user-wrapper'}>
                <div className='time-stamp'>{message.timestamp.time}</div>
                <div>{message.message}</div>
            </div>)
            })}
            </div>
            <div className="search-bar">
                <form onSubmit={sendMessag
                    <div className="icons">
                        <ion-icon name="happy-outline"></ion-icon>
                        <ion-icon name="attach-sharp"></ion-icon>
                    </div>

                    <input value={input}
                           onChange={(e) => setInput(e.target.value)}
                           type="search" name="" id=""
                           placeholder='Send a Message'/>

                    <button onClick={sendMessage} type="button">

                        <ion-icon name="navigate-circle"></ion-icon>
                    </button>
                </form>
            </div>
            </>
        )
    }



    // useEffect(() => {
    //     console.log(scrollbar.getBoundingClientRect().height)
    // }, [])

    return (
        <section className='messages-wrapper'>
            {display()}
        </section>
        );
}

export default Messages;