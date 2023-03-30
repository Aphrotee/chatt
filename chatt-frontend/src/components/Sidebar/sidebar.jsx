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
    const uloading = useRef(null);
    const qloading = useRef(null);
    const usernameRef = useRef(null);
    const UsernameRef = useRef(null);
    const usernameEditRef = useRef(null);
    const quoteRef = useRef(null);
    const QuoteRef = useRef(null);
    const quoteEditRef = useRef(null);
    const searchWrapper = useRef(null)
    const profileWrapper = useRef(null);
    const profileBackground = useRef(null);

    const [navState, setNavState] = useState(false)
    const visible = () => setNavState(!navState)
    const navigate = useNavigate();

    // State variables
    const [user, setUser] = useState([])
    const umsg = useRef(null);
    const [UMsg, setUMsg] = useState("");
    const qmsg = useRef(null);
    const [QMsg, setQMsg] = useState("");
    const [input, setInput] = useState(null);
    const [inputs, setInputs] = useState({});
    const [messages, setMessages] = useState([])
    const [allUsers, setAllUsers] = useState([]);
    const [uLoading, setULoading] = useState(false);
    const [qLoading, setQLoading] = useState(false);
    const [state, setState] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [containers, setContainers] = useState([]);
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

    const handleEditChange = (event) => {
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
                    <div className='wrap' onClick={() => {getContainer(user.id)}} >
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

    const applyUMessage = (message, success) => {
        if (success) {
          umsg.current.style.color = 'green';
        } else {
          umsg.current.style.color = 'red';
        }
        setUMsg(message);
      }
    
      const applyQMessage = (message, success) => {
        if (success) {
          qmsg.current.style.color = 'green';
        } else {
          qmsg.current.style.color = 'red';
        }
        setQMsg(message);
      }
      

    const updateStatus = (event) => {
        event.preventDefault();
        console.log(qLoading);
        if (!qLoading) {
          const { quote } = inputs;
  
          setQMsg("");
          if (!quote) {
            applyQMessage("Please enter status quote", false)
          }  else {
              setQLoading(!qLoading);
              qloading.current.style.opacity = 0.6
              qloading.current.style.cursor = 'not-allowed';
              const userId = cookies.get('chatt_userId');
              axios.put('/users/update-bio',
              { quote },
              {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Token': token
                }
              })
                .then((response) => {
                  applyQMessage(`updated bio`, true);
                  setUser(response.data);
                  qloading.current.style.opacity = 1
                  qloading.current.style.cursor = 'default';
                  setTimeout(() => {
                    closeNameEdit();
                  }, 1500)
                })
                .catch((err) => {
                  setQLoading(false);
                  qloading.current.style.opacity = 1
                  qloading.current.style.cursor = 'pointer';
                  if (err.response.status === 500) {
                    console.log(err.response.data);
                    applyQMessage('Network error, please try again later', false);
                  } else {
                    applyQMessage(`${err.response.data['error']}`, false);
                  }
                });
          }
        }
    }

    const updateUsername = (event) => {
        event.preventDefault();
        if (!uLoading) {
          const { username } = inputs;
  
          setUMsg("");
          if (!username) {
            applyUMessage("Please enter status quote", false)
          }  else {
              setULoading(!uLoading);
              uloading.current.style.opacity = 0.6
              uloading.current.style.cursor = 'not-allowed';
              axios.put('/users/update-username',
              { username },
              {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Token': token
                }
              })
                .then((response) => {
                  applyUMessage(`updated username`, true);
                  setUser(response.data);
                  uloading.current.style.opacity = 1
                  uloading.current.style.cursor = 'default';
                  setTimeout(() => {
                    closeNameEdit();
                  }, 1500)
                })
                .catch((err) => {
                  setULoading(false);
                  uloading.current.style.opacity = 1
                  uloading.current.style.cursor = 'pointer';
                  if (err.response.status === 500) {
                    console.log(err.response.data);
                    applyUMessage('Network error, please try again later', false);
                  } else {
                    applyUMessage(`${err.response.data['error']}`, false);
                  }
                });
          }
        }
      }

    const openNameEdit = () => {
        UsernameRef.current.style.display = 'none';
        usernameRef.current.style.display = 'none';
        usernameEditRef.current.style.display = 'flex';
        
    }

    const openQuoteEdit = () => {
        quoteRef.current.style.display = 'none';
        QuoteRef.current.style.display = 'none';
        quoteEditRef.current.style.display = 'flex';
    }
    const closeNameEdit = () => {
        UsernameRef.current.style.display = 'block';
        usernameRef.current.style.display = 'block';
        usernameEditRef.current.style.display = 'none';
    }

    const closeQuoteEdit = () => {
        quoteRef.current.style.display = 'block';
        QuoteRef.current.style.display = 'block';
        quoteEditRef.current.style.display = 'none';
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

                <div ref={searchWrapper} className="search-wrapper">
                    {matchedUsers()}
                </div>

                <div className={state? 'chats-wrapper' : 'hidden'}>
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
            </div>
            </section>

            <Messages messages={messages} user={user} other={other} otherUser={otherUser} setContainers={setContainers}/>
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
                    <img src={defaultPic} alt="No profile photo" />
                    <div className='info'>
                        <div className='username-text' ref={UsernameRef}>{'@' + user.username}</div>
                        <div className='username-edit' ref={usernameRef} onClick={openNameEdit} ><ion-icon name="create"></ion-icon></div>
                        <div>
                            <form name="updateUsernameForm" onSubmit={updateUsername}>
                                <div className='updateForm' ref={usernameEditRef}>
                                    <div className='username'>
                                        <input type="text" name="username" placeholder={user.username} value={inputs.quote} onChange={handleEditChange} /></div>
                                    <div className='buttons' id="button" ref={uloading} type="submit" onClick={updateUsername}><ion-icon name="checkmark-outline"></ion-icon></div>
                                    <div className='buttons' id="cancel"  onClick={closeNameEdit} > <ion-icon name="close-outline" ></ion-icon></div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class='message' ref={umsg}>{UMsg}</div>
                    <div className='info'>
                        <div className='quote-text' ref={QuoteRef}>{user.quote}</div>
                        <div className='quote-edit' ref={quoteRef} onClick={openQuoteEdit} ><ion-icon ame="create"></ion-icon></div>
                        <div>
                            <form name="updateQuoteForm" onSubmit={updateStatus}>
                                <div className='updateForm' ref={quoteEditRef}>
                                    <div className='quote'>
                                        <input type="text" name="quote" placeholder={user.quote} value={inputs.quote} onChange={handleEditChange} /></div>
                                    <div className='buttons' id="button" ref={qloading} type="submit" onClick={updateStatus}><ion-icon name="checkmark-outline"></ion-icon></div>
                                    <div className='buttons' id="cancel"  onClick={closeQuoteEdit} > <ion-icon name="close-outline" ></ion-icon></div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class='message' ref={qmsg}>{QMsg}</div>
                    <div className='info'>
                        <div>{user.email}</div>
                    </div>
                    {/* <div>
                        <form name="updateStatusQuoteForm" onSubmit={updateStatus}>
                            <div className='quote'>
                                <input type="text" name="quote" placeholder={user.quote} value={inputs.quote} onChange={handleStatusChange} /></div>
                            <input id="button" ref={loading} type="submit" value={updateBtn} />
                            <p class='message' ref={msg} >{Msg}</p>
                        </form>
                    </div> */}
                    {/* <div className='other-options'>
                        <form name="updateProfilePhotoForm">
                            <div className="update-profile-photo">
                                <div className='UpdateBtn' type="button" id="button" placeholder="Update profile photo" value={inputs.quote} onChange={handleEditChange} >Update profile photo</div>
                                <div className="updateForm">
                                    <div><input type="file" name="profilephoto" placeholder={'upload image'} value={inputs.profilephoto} onChange={handleEditChange} /></div>
                                    <div className='buttons' id="button" ref={qloading} type="submit" onClick={updateStatus}><ion-icon name="checkmark-outline"></ion-icon></div>
                                </div>
                            </div>
                        </form>
                    </div> */}
                </div>
            </div>
        </>
        );
}

export default Sidebar;