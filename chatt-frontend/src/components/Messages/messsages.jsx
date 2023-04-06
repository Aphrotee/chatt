import './messages.scss';
import axios from '../../axios'
import cookies from '../../cookies'
import { v4 } from 'uuid';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector} from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Display } from '../../actions/display';
const defaultPic = import.meta.env.VITE_DEFAULT_PIC;


const Messages = ({ messages, user, other, otherUser, setState, setSearchInput, setMessages}) => {

    const [input, setInput] = useState('')
    const scrollbar = useRef(null);
    const lastMessage = useRef(null);
    const message = useRef(null);
    const messagesRef = useRef(null);
    const cookie = cookies.get('X-Token');
    const isMobile = useMediaQuery({query: `(max-width: 768px)`});
    const messageDisplay = useSelector(state => state.setDisplay);
    const dispatch = useDispatch()
    const match = window.matchMedia('(max-width: 768px)').matches
    // responsive based on media width
    useEffect(() => {

        if (!isMobile || (isMobile && !messageDisplay)) {
            message.current.style.display = 'block';

        } else if (isMobile && messageDisplay) {
            message.current.style.display = 'none';
        }

    }, [messageDisplay, isMobile])

    const sendMessage = async (e) => {
        e.preventDefault()

        const data =  {
            message: input,
            containerId: other.id,
            receiverId: other.otherId,
            senderId: user.id,
            type: "text",
            dummyId: v4()
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

    useEffect(() => {
        if (lastMessage.current !== null) {
            lastMessage.current.scrollIntoView({ smooth: true });
        }
        if (messagesRef.current !== null) {
            messagesRef.current.style.marginTop = '4em';
        }
    }, [messages]);

    const display = () => {
        if (messages !== undefined && other) {
            if (messages.length === 0 && otherUser === null) {
                return (
                <div ref={scrollbar} className="empty">
                    <div>
                            <img src={import.meta.env.VITE_EMPTY_MESSAGE_SVG} alt="" />
                    </div>
                    <div>
                        <p>Chatt Instant Messaging</p>
                        <p>Send instant messages to friends and loved ones to keep in touch with another</p>
                    </div>
                </div>)
            }
        }

        const getProfilePhoto = (container) => {
            if (user !== undefined) {
                if (user.profilePhoto === undefined) user.profilePhoto = '';
                if (container.profilePhoto) return (<img src={container.profilePhoto} alt={container? container.name: ''} />);
                if (container.membersPhotos) {
                    if (container.membersPhotos.length > 0) {
                        const profilePhoto = container.membersPhotos.filter((photo) => {
                            if (photo !== user.profilePhoto) return true;
                            return false;
                        });
                        if (profilePhoto.length) {
                            if (profilePhoto[0]) {
                                return (<img src={profilePhoto[0]} alt="" />);
                            } else {
                                return (<img src={defaultPic} />);
                            }
                        }
                    } else {
                        return (<img src={defaultPic} />);
                    }
                } else {
                    return (<img src={defaultPic} />);
                }
            }
        }

        return (
            <>
            <div className="user-nav">
                {match ? <span onClick={() => dispatch(Display())}><ion-icon name="arrow-back-outline"></ion-icon></span> : null}
                <div>{getProfilePhoto(other)}</div>
                <div>
                    <p>{other? other.name: ""}</p>
                        <p>{other ? `Last reply at ${other.lastSeen}`: ''}</p>
                </div>
                <div>
                    <ion-icon name="call-outline"></ion-icon>
                </div>
            </div>

            <div ref={scrollbar} className='messages'>
                {messages? messages.map((message, index) => {
                    const LastMssage = messages.length - 1 === index;
                    if (Object.keys(message).length !== 0 && user !== undefined) {
                        return (
                            <div key={index} ref={LastMssage ? lastMessage: null}
                                className={message.receiverId !==  user.id ? 'current-user-wrapper': 'other-user-wrapper'}>
                                <div className='time-stamp'>{message.timestamp ? message.timestamp.time : 'sending'}</div>
                                <div>{message.message}</div>
                            </div>
                        )
                    }
                }): <div></div>}
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
                        <ion-icon name="paper-plane"></ion-icon>
                    </button>
                </form>
            </div>
                </>
            )
        }

        return (
            <section ref={message} className='messages-wrapper'>
                {display()}
            </section>
        );
    }


export default Messages;