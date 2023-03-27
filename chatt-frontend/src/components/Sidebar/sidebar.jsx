import './sidebar.scss';
import Navbar from '../Navbar/navbar';
import Messages from '../Messages/messsages'
import Pusher from 'pusher-js'
import axios from '../../axios'
import cookies from '../../cookies';
import gsap from 'gsap';
import { useEffect, useState, useRef } from 'react'
const defaultPic = '../../src/images/profile (1).png';

const Sidebar = () => {
    // browser cookie
    const cookie = cookies.get('X-Token')

    // DOM references
    const chatt = useRef()
    const loader = useRef()
    const details = useRef()
    const currentCon = useRef()
    const searchWrapper = useRef(null)

    // State variables
    const [user, setUser] = useState([])
    const [input, setInput] = useState(null);
    const [messages, setMessages] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [state, setState] = useState(true)
    const [otherUser, setOtherUser] = useState(null);
    const [containers, setContainers] = useState([]);
    const [other, setOther] = useState({"name":"", "lastSeen":"", "id" : "", "otherId": ""})

    useEffect(() => {
        gsap.fromTo(loader.current, {display: 'block'}, {display: 'none', duration: 3})
        gsap.fromTo(chatt.current, {opacity: 0}, {opacity: 1, duration: 1, delay: 1.5})
        gsap.fromTo(details.current, {opacity: 0, y: 200}, {opacity: 1, y: 280, duration: 1})
    }, [])

    useEffect(() => {

                axios.get("containers/all", {
                    headers: {
                        'X-Token': cookie
                        }
                }).then((response) => {

                setContainers(response.data)
                })

                axios.get('/users/me', {
                    headers: {
                        'X-Token': cookie
                    }
                }).then((response) => {
                    setUser(response.data);
                })
                },
    []);

    useEffect(() => {
        const pusher = new Pusher('5ac65fc188cfeb946d3c', {
            cluster: 'mt1'
          });

            const channel = pusher.subscribe('messages');
            channel.bind('inserted', function(data) {
                setMessages([...messages, data])
            })

            return () => {
                channel.unbind_all()
                channel.unsubscribe()
              }
          }, [messages]);

    const getMessages = (id, otheruser) => {
        setOtherUser(otheruser);
        axios.get(`/messages/${id}/all`, {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {
            setMessages(response.data)
        })
    }


    const userDisplay = () => {

        if (containers.length === 0) {
            return (
            <div className='noUser'>
                <p>You have no recent chats.</p>
                <p>Search for users and start a conversation now</p>
            </div>)
        }

        return (
            containers.map((container) => {

                return (<div className="wrap" key={container._id}
                             onClick={() => {getMessages(container._id);
                                             getName(container.membersUsernames.filter(name => name !== user.username));
                                             getlastSeen( container.timestamp.time);
                                             getId(container._id);
                                             get_id(container.members.filter(member => member !== user.id));
                                             setBorder();
                                             }}>
                    <div>
                        <img src={defaultPic} alt="" />
                        <div className='notifications'>
                            <div>99</div>
                        </div>
                    </div>
                    <div className='details'>

                      <span>{container.membersUsernames.filter(name => name !== user.username)}</span>
                        <p>{container.lastMessage}</p>
                    </div>
                    <div className="timestamp">
                        <span>{container.timestamp.time}</span>
                    </div>
                </div>)
            })
        )
    }

    const getName = (name) => {
        setOther(existingValues => ({
            ...existingValues,
            name: name,
        }))
    }

    const getlastSeen = (lastSeen) => {
        setOther(existingValues => ({
            ...existingValues,
            lastSeen: lastSeen
        }))
    }

    const getId = (id) => {
        setOther(existingValues => ({
            ...existingValues,
            id:id
        }))
    }

    const get_id = (_id) => {

        if (Array.isArray(_id)) {
            _id = _id[0]
        }

        setOther(existingValues => ({
            ...existingValues,
            otherId:_id
        }))
    }


    const getUsers = () => {
        axios.get('/users/all', {
            headers: {
                'X-API-Key': import.meta.env.VITE_API_KEY
            }
        })
          .then((response) => {
            setAllUsers(response.data);
          })
          .catch((err) => {
            console.log(err);
            setAllUsers(['Opeyemi', 'Oreoluwa', 'Fiyin', 'Ayomide', 'odunayo', 'Ayodele', 'Oluwatobi', 'ola',
               'joy', 'Renee', 'Bolatito', 'Aphrotee', 'Pamilerin', 'Aphrtee', 'Ibrahim', 'Idris', 'olufunmi',
               'binta', 'pelumi', 'Funto', 'funmi', 'benita'
            ]);
          });
    }

    const setBorder = () => {

    }

    const handleChange = (event) => {
        const query = event.target.value;
        console.log(query)

        if (!query) {
            console.log(query)
            setState(true)
            setInput(null);
        } else {
            setState(false)
            setInput(query);
        }
    }

    const getContainer = (receiver) => {
        axios.get(`/container/${receiver}`, {
            headers: {
                'X-Token': cookies.get('X-Token')
            }
        })
          .then((response) => {
            const containerId = response.data._id;
            const otheruser = response.data.membersUsernames.filter((name) => name !== cookies.get('chatt_username'))[0];
            getMessages(containerId, otheruser);
            getId(containerId);

          })
    }


    const matchedUsers = () => {
        const match = allUsers.filter((user) => {
            if (new RegExp(`^${input}`, 'i').test(user.username)) {
                return true;
            } else {
                return false;
            }
        });
        if (!match.length && input) {
            return (<div className='noUser' >No users found</div>)
        } else {

            return match.map((user) => {
                return (
                    <div className='wrap' onClick={() => {
                        getContainer(user.id);
                        getName(user.username);
                        get_id(user.id);
                        }} >
                        <div>
                            <img src={defaultPic} alt=""/>
                        </div>
                        <div className='details'>
                            <span>{user.username}</span>
                            <p>{user.quote}</p>
                        </div>
                    </div>
                )
            });
        }
    }




    return (
        <>
            <section className='sidebar'>
            <Navbar />
            <div className='chats'>
                <div className='menu'>
                    <input type="search" placeholder='Search to start a converstion' value={input || ''} onClick={getUsers} onChange={handleChange} />
                    <ion-icon name="search-outline"></ion-icon>
                </div>

                <div ref={searchWrapper} className={state? 'hidden' : 'search-wrapper'}>
                    {matchedUsers()}
                </div>

                <div className={state? 'chats-wrapper' : 'hidden'}>
                    {userDisplay()}
                </div>

            </div>
            </section>

            <Messages   messages={messages}
                        user={user}
                        other={other}
                        otherUser={otherUser}
                        setContainers={setContainers}
                        setState={setState}
                        setSearchInput={setInput}/>
            <div ref={loader} className='loading'>
                <div ref={details}>
                    <p>Chatt Instant Messaging</p>
                    <p ref={chatt}> Keeping in touch with friends, family and onnecting with new people all over the world </p>
                </div>
            </div>
        </>
        );
}

export default Sidebar;