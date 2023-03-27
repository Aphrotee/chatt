import './sidebar.scss';
import Messages from '../Messages/messsages'
import Pusher from 'pusher-js'
import axios from '../../axios'
import cookies from '../../cookies';
import gsap from 'gsap';
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
const defaultPic = '../../src/images/profile (1).png';


const Sidebar = () => {
    // browser cookie
    const cookie = cookies.get('X-Token');

    // DOM references
    const chatt = useRef()
    const loader = useRef()
    const details = useRef()
    const currentCon = useRef()
    const loading = useRef(null);
    const searchWrapper = useRef(null)
    const profileWrapper = useRef(null);
    const profileBackground = useRef(null);

    const [navState, setNavState] = useState(false)
    const visible = () => setNavState(!navState)
    const navigate = useNavigate();

    // State variables
    const [user, setUser] = useState([])
    const msg = useRef(null);
    const [Msg, setMsg] = useState("");
    const [input, setInput] = useState(null);
    const [inputs, setInputs] = useState({});
    const [messages, setMessages] = useState([])
    const [allUsers, setAllUsers] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [state, setState] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [containers, setContainers] = useState([]);
    const [updateBtn, setUpdateBtn] = useState("Update");
    const [profileState, setProfileState] = useState(false);
    const [other, setOther] = useState({"name":"", "lastSeen":"", "id" : "", "otherId": ""})

    useEffect(() => {
        gsap.fromTo(loader.current, {display: 'block'}, {display: 'none', duration: 3})
        gsap.fromTo(chatt.current, {opacity: 0}, {opacity: 1, duration: 1, delay: 1.5})
        gsap.fromTo(details.current, {opacity: 0, y: 200}, {opacity: 1, y: 280, duration: 1})
    }, []);

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

    const logout = () => {
        axios.delete('/auth/logout', {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {
            setUser(response.data);
            navigate('/login');
            cookies.remove('X-Token');
            cookies.remove('chatt_userId');
            cookies.remove('chatt_username');

        });
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

    const handleStatusChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
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

    const removeProfile = () => {
        profileBackground.current.style.display = 'none';
        profileWrapper.current.style.display = 'none';
    }

    const showProfile = () => {
        profileBackground.current.style.display = 'flex';
        profileWrapper.current.style.display = 'flex';
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
              const userId = cookies.get('chatt_userId');
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
        <>
            <section className='sidebar'>
            <nav>
                <div> Chatt </div>
                    <div>
                        <div onClick={visible}>
                            <ion-icon name="ellipsis-vertical"></ion-icon>
                        </div>
                        <div className={navState ? "dropdown": "hidden"}>
                        <ul>
                            <li onClick={showProfile}>Profile</li>
                            <li onClick={logout}>Log Out</li>
                        </ul>
                    </div>
                </div>
            </nav>
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
            <div ref={profileBackground} className="profile-background">
            </div>
            <div ref={profileWrapper} className="profile-wrapper">
                <div className="user-profile-box" >
                    <div className="header-box">
                        <div className="header-text" >Profile</div>
                        <div className="exit" onClick={removeProfile} >
                            <ion-icon name="close-outline"></ion-icon>
                        </div>
                    </div>
                    <img src={defaultPic} alt="" />
                    <div><p>{'@' + user.username}</p></div>
                    <div><p>{user.quote}</p></div>
                    <div><p>{user.email}</p></div>
                    {/* <div>
                        <form name="updateStatusQuoteForm" onSubmit={updateStatus}>
                            <div className='quote'>
                                <input type="text" name="quote" placeholder={user.quote} value={inputs.quote} onChange={handleStatusChange} /></div>
                            <input id="button" ref={loading} type="submit" value={updateBtn} />
                            <p class='message' ref={msg} >{Msg}</p>
                        </form>
                    </div> */}
                    <p><u className="other-options" >Update username</u></p>
                    <p><u className="other-options" >Update email</u></p>
                    <p><u className="other-options" >Update password</u></p>
                    <p><u className="other-options" >Update status quote</u></p>
                </div>
            </div>
        </>
        );
}

export default Sidebar;