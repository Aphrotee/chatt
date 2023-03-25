import './sidebar.scss';
import Navbar from '../Navbar/navbar';
import Messages from '../Messages/messsages'
import Pusher from 'pusher-js'
import axios from '../../axios'
import cookies from '../../cookies';
import { useEffect, useState, useRef } from 'react'
const IMG1 = '../../src/images/IMG_1445.JPG';

const Sidebar = () => {


    const searchWrapper = useRef(null);
    const [containers, setCotainers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [input, setInput] = useState(null);

    useEffect(() => {

                axios.get('/containers/all', {
                    headers: {
                        'X-Token': cookies.get('X-Token')
                    }
                }).then((response) => {
                    setCotainers(response.data)
                })

                axios.get('/users/me', {
                    headers: {
                        'X-Token': cookies.get('X-Token')
                    }
                }).then((response) => {
                    setUser(response.data);
                })
                },
    []);

    // useEffect(() => {
    //     const pusher = new Pusher('5ac65fc188cfeb946d3c', {
    //         cluster: 'mt1'
    //       });

    //         const channel = pusher.subscribe('messages');
    //         channel.bind('inserted', function(data) {
    //             console.log(data)
    //         })

    //         return () => {
    //             channel.unbind_all()
    //             channel.unsubscribe()
    //           }
    //       }, [containers]);

    const getMessages = (id, otheruser) => {
        setOtherUser(otheruser);
        axios.get(`/messages/${id}/all`, {
            headers: {
                'X-Token': cookies.get('X-Token')
            }
        }).then((response) => {
            setMessages(response.data)
        })
    }

    const userDisplay = () => {
        if (containers.length === 0) {
            return (
            <div className='noUser'>
                <p>You have no recent chats <br />
                Search for users to start a conversation now</p>
            </div>)
        }

        return (
            // containers.filter((container) => {
            //     if (container.nummberOfMessages) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // });
            containers.map((container) => {
                return (<div key={container._id} onClick={() => {getMessages(container._id, container.membersUsernames.filter((name) => name !== cookies.get('chatt_username')))}}>
                    <div>
                        <img src={IMG1} alt="" />
                        <div className='notifications'>
                            <div>99</div>
                        </div>
                    </div>
                    <div className='details'>
                        <span>{container.membersUsernames.filter((name) => name !== cookies.get('chatt_username'))}</span>
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
            </div>
        </section>
        <Messages messages={messages} user={user} otherUser={otherUser} />
        </>
        );
}

export default Sidebar;