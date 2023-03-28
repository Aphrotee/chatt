import './messages.scss';
import axios from '../../axios'
import cookies from '../../cookies'
import { useState, useRef, useEffect} from 'react'


const Messages = ({ messages, user, other, otherUser, setContainers, setState, setSearchInput, socket, setMessages}) => {

    const [input, setInput] = useState('')
    const scrollbar = useRef(null);
    const cookie = cookies.get('X-Token');
    console.log('otherId', other.otherId);

    const setContainersOnly = (containers, updatedContainer) => {
        const newContainers = containers.filter(container => {
            if (container._id !== updatedContainer._id) {
                return true;
            } else {
                return false;
            }
        });
        return [updatedContainer, ...newContainers];
    }

    const setMessagesOnly = (messages, newMessage) => {
        const newMessages = messages.filter(message => {
            if (message._id !== newMessage._id) {
                return true;
            } else {
                return false;
            }
        });
        return [...newMessages, newMessage];
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        const data =  {
            message: input,
            containerId: other.id,
            receiverId: other.otherId,
            senderId: user.id,
            type: "text",
        }
        setMessages((messages) => [...messages, data])
        setInput("")
        setSearchInput("");


        await axios.post('/messages/new', data, {
            headers: {
                        'X-Token': cookie
                     }
        })
        setState(true);

        // axios.get("containers/all", {
        //     headers: {
        //         'X-Token': cookie
        //     }
        // }).then((response) => {

        // setContainers(response.data)
        // })
    }

    socket.on('new message', (message) => {
        // setMessages((messages) => [...messages, message]);
        setMessages((messages) => setMessagesOnly(messages, message));
        // axios.get("containers/all", {
        //     headers: {
        //         'X-Token': cookie
        //     }
        // }).then((response) => {

        // // setContainers(response.data)
        // });
    });

    socket.on('continer updated', (container) => {
        if (container.members.includes(user.id))
        setContainers((containers) => setContainersOnly(containers, container));
    });

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
            <div /**key={message._id}*/ className={message.receiverId !==  user.id ? 'current-user-wrapper': 'other-user-wrapper'}>
                <div className='time-stamp'>{message.timestamp ? message.timestamp.time : 'sending'}</div>
                <div>{message.message}</div>
            </div>)
                }
            })}
            </div>

            <div className="search-bar">
                <form onSubmit={sendMessage}>
                    <div className="icons">
                        <ion-icon name="happy-outline"></ion-icon>
                        <ion-icon name="attach-sharp"></ion-icon>
                    </div>

                    <input value={input}
                           onChange={(e) => setInput(e.target.value)}
                           type="search" name="" id=""
                           placeholder='Send a Message'/>

                    <button onClick={sendMessage} type="button">
                        <ion-icon name="paper-plane-outline"></ion-icon>
                    </button>
                </form>
            </div>
            </>
        )
    }


    return (
        <section className='messages-wrapper'>
            {display()}
        </section>
        );
}

export default Messages;