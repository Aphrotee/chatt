import './sidebar.scss';
import Navbar from '../Navbar/navbar';
import Messages from '../Messages/messsages'
import Pusher from 'pusher-js'
import axios from '../../axios'
import cookies from '../../cookies';
import { useEffect, useState, useRef } from 'react'
const IMG1 = '../../src/images/images/profile (1).png';

const Sidebar = () => {


    const searchWrapper = useRef(null)
    const [otherUser, setOtherUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [input, setInput] = useState(null);
    const loader = useRef()
    const chatt = useRef()
    const details = useRef()
    const [containers, setContainers] = useState(null);
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState([])
    const [other, setOther] = useState({"name":"", "lastSeen":"", "id" : "", "otherId": ""})
    const cookie = cookies.get('X-Token')

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
        if (containers === null) return <div></div>


        if (containers.length === 0) {
            return (
            <div className='noUser'>
                <p>You have no recent chats.</p>
                <p>Search for users and start a conversation now</p>
            </div>)
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
        setOther(existingValues => ({
            ...existingValues,
            otherId:_id
        }))
    }

    console.log('onClick', messages)
    console.log('containers', containers)
        return (
            // containers.filter((container) => {
            //     if (container.nummberOfMessages) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // });
            containers.map((container) => {

                return (<div className="wrap" key={container._id}
                             onClick={() => {getMessages(container._id);
                                             getName(container.membersUsernames.filter(name => name !== user.username));
                                             getlastSeen( container.timestamp.time);
                                             getId(container._id);
                                             get_id(container.members.filter(member => member !== user.id));
                                             }}>
                    <div>
                        <img src={defaultPic} alt="" />
                        <div className='notifications'>
                            <div>99</div>
                        </div>
                    </div>
                    <div className='details
                    
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

    const handleChange = (event) => {
        const query = event.target.value;
        if (!query) {
            setInput(null);
        } else {
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
        if (!input) {
            if (searchWrapper.current !== null) {
              searchWrapper.current.style.display = 'none';
            }
        } else if (!match.length && input) {
            if (searchWrapper.current !== null) {
                searchWrapper.current.style.display = 'block';
            }
            return (<div className='noUser' >No users found</div>)
        } else {
            if (searchWrapper.current !== null) {
                searchWrapper.current.style.display = 'block';
            }
            return match.map((user) => {
                return (
                    <div onClick={() => {getContainer(user.id)}} >
                        <div>
                            <img src={IMG1} alt=""/>
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
                <div ref={searchWrapper} className="search-wrapper">
                    {matchedUsers()}
                </div>

                <div className='chats-wrapper'>
                    {userDisplay()}
                </div>
                    
                <div className="search-wrapper hidden">
                <div>
                        <div>
                            <img src={defaultPic} alt="" />
                            <div className='notifications'>
                                <div>99</div>
                            </div>
                        </div>
                        <div className='details'>
                            <span>Cecilia Atabong</span>
                            <p>This is the last time it is yes it is</p>
                        </div>
                        <div className="timestamp">
                            <span>3:45</span>
                        </div>
                    </div>
                </div>
    

            </section>
            <Messages messages={messages} user={user} other={other} otherUser={otherUser} setContainers={setContainers}/>
            <div ref={loader} className='loading'>
                <div ref={details}>
                    <p>Chatt Instant Messaging</p>
                    <p ref={chatt}>Keeping in touch with friends, family and onnecting with new people all over the world </p>
                </div>
            </div>
        </>
        );

}

export default Sidebar;