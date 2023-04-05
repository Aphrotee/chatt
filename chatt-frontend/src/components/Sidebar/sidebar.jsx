import './sidebar.scss';
import Messages from '../Messages/messsages'
// import Pusher from 'pusher-js'
import axios from '../../axios'
import cookies from '../../cookies';
import gsap from 'gsap';
import { useEffect, useState, useRef, createRef } from 'react'
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
const defaultPic = import.meta.env.VITE_DEFAULT_PIC;
let socket;


const Sidebar = () => {
    // browser cookie
    const cookie = cookies.get('X-Token');
    const userId = cookies.get('chatt_userId');


    const navigate = useNavigate();

    // socket instance
    useEffect(() => {
        if (!cookie || cookie === null) {
            navigate('/login');
        }
        // socket = io('http://172.27.31.67:9000');
        socket = io('https://chatt.cyclic.app');
        socket.emit('user connect', userId);
        console.log('connecting')
        return () => socket.disconnect();
    }, []);



    // useEffect(() => {
    //     socket.emit('user connect', userId);
    //     // socket.on('connected to socket', () => {
    //     //     alert('connected to socket');
    //     // })
    // }, [socket]);

    // DOM references
    const chatt = useRef()
    const loader = useRef()
    const details = useRef()
    const uloading = useRef(null);
    const uloadingx = useRef(null);
    const qloading = useRef(null);
    const qloadingx = useRef(null);
    const ploading = useRef(null);
    const ploadingx = useRef(null);
    const imageRef = createRef();
    const usernameRef = useRef(null);
    const UsernameRef = useRef(null);
    const usernameEditRef = useRef(null);
    const quoteRef = useRef(null);
    const QuoteRef = useRef(null);
    const quoteEditRef = useRef(null);
    const loading = useRef(null);
    const sidebar = useRef()
    const searchWrapper = useRef(null)
    const profileWrapper = useRef(null);
    const fileSelector = useRef(null);
    const uploadBtn = useRef(null);
    const uploadHandler = useRef(null)
    const profileBackground = useRef(null);
    const smallProfilePic = useRef(null);
    const bigProfilePic = useRef(null);


    const [navState, setNavState] = useState(false)
    const visible = () => setNavState(!navState)

    // State variables
    const [user, setUser] = useState([])
    const umsg = useRef(null);
    const [UMsg, setUMsg] = useState("");
    const qmsg = useRef(null);
    const [QMsg, setQMsg] = useState("");
    const pmsg = useRef(null);
    const [PMsg, setPMsg] = useState("");
    const [input, setInput] = useState(null);
    const [inputs, setInputs] = useState({});
    const [image, _setImage] = useState(null);
    const [messages, setMessages] = useState([])
    const [allUsers, setAllUsers] = useState([]);
    const [uLoading, setULoading] = useState(false);
    const [qLoading, setQLoading] = useState(false);
    const [pLoading, setPLoading] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [members, setMembers] = useState([])
    const [state, setState] = useState(true);
    const [userConnected, setUserConnected] = useState(false);
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
        socket.on('user connected', (userid) => {
            // alert('user connected?', userConnected);
            if (userId === userid) setUserConnected(true);
        });
        return () => socket.off('user connected');
    });

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
        });
    }, []);


    const setContainersOnly = (oldContainers, updatedContainer) => {
        const newContainers = oldContainers.filter(container => {
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
            if (message.dummyId !== newMessage.dummyId) {
                return true;
            } else {
                return false;
            }
        });
        return [...newMessages, newMessage];
    }

    useEffect(() => {
        socket.on('new message', (message) => {
            // setMessages((messages) => [...messages, message]);
            if (message.containerId === other.id) {
                setMessages((messages) => setMessagesOnly(messages, message));
            }
            // axios.get("containers/all", {
            //     headers: {
            //         'X-Token': cookie
            //     }
            // }).then((response) => {

            // // setContainers(response.data)
            // });
        });
        return () => socket.off('new message');
    });


    useEffect(() => {
        socket.once('container updated', (container) => {
            // alert('update container';)
            container.members.forEach(memberId => {
                if (memberId.toString() === userId.toString()) {
                    // alert(container.container._id);
                    setContainers((containers) => setContainersOnly(containers, container.container));
                }
            });
        });

        return () => socket.off('container updated');
    });

    const mediaQuery = () => {
        const query = window.matchMedia("(max-width: 768px)");
        if (query.matches && media) {
            sidebar.current.style.display = 'none';
            setMedia(!state)
        }
    }

    const getMessages = (id, otheruser) => {
        setOtherUser(otheruser);
        socket.emit('open container', id);
        axios.get(`/messages/${id.toString()}/all`, {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {
            setMessages(response.data);
        });
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

    const getProfilePhoto = (container) => {
        if (user.profilePhoto === undefined) user.profilePhoto = '';
        if (container.membersPhotos) {
            // console.log('first', container.membersPhotos);
            if (container.membersPhotos.length > 0) {
                // console.log('second if', container.membersPhotos);
                const profilePhoto = container.membersPhotos.filter((photo) => {
                    if (photo !== user.profilePhoto) return true;
                    return false;
                });
                // console.log('third', profilePhoto, user.profilePhoto);
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

    const getTimestamp = (container) => {
        if (container.timestamp) {
            return container.timestamp.time;
        } else {
            return '';
        }
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
                             onClick={(e) => {getMessages(container._id);
                                             getName(container.membersUsernames.filter(name => name !== user.username));
                                             getlastSeen( container.timestamp.time);
                                             getId(container._id);
                                             getContainerProfilePhoto(container);
                                             get_id(container.members.filter(member => member !== user.id));
                                            //  getContainer(container.members.filter(member => member !== user.id)[0]);
                                             setMembers(container.members);
                                             mediaQuery();
                                             }}>
                    <div>{getProfilePhoto(container)}
                        <div className='notifications'>
                            <div>99</div>
                        </div>
                    </div>
                    <div className='details'>

                      <span>{container.membersUsernames.filter(name => name !== user.username)}</span>
                        <p>{container.lastMessage}</p>
                    </div>
                    <div className="timestamp">
                        <span>{getTimestamp(container)}</span>
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

    const getContainerProfilePhoto = (container) => {
        if (user.profilePhoto === undefined) user.profilePhoto = '';
        if (container.membersPhotos) {
            if (container.membersPhotos.length > 0) {
                const profilePhoto = container.membersPhotos.filter((photo) => {
                    if (photo !== user.profilePhoto) return true;
                    return false;
                });
                if (profilePhoto.length) {
                    if (profilePhoto[0]) {
                        setOther(existingValues => ({
                            ...existingValues,
                            profilePhoto: profilePhoto[0]
                        }));
                        console.log(other);
                        return;
                    }
                }
            }
        }
        setOther(existingValues => ({
            ...existingValues,
            profilePhoto: defaultPic
        }));
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

        if (!query) {
            searchWrapper.current.style.display = 'none';
            setInput(null);
        } else {
            searchWrapper.current.style.display = 'flex';
            setInput(query);
        }
    }

    const handleEditChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
        if (event.target.type === 'file') {
            console.log(event.target);
            setInputs(values => ({ ...values, ['file_' + name]: event.target.files[0] }));
            setInputs(values => ({ ...values, [name]: event.target.files[0].name }));
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
            getContainerProfilePhoto(response.data);
            setMembers(response.data.members)
          })
    }


    const matchedUsers = () => {
        const match = allUsers.filter((user) => {
            if (new RegExp(`\^${input}`, 'i').test(user.username)) {
                return true;
            } else {
                return false;
            }
        });
        if (!match.length && input) {
            return (<div className='noUser' >No users found</div>)
        } else {

            return match.map((user) => {
                console.log('user', user)
                return (
                    <div className='wrap' onClick={() => {
                        getContainer(user.id);
                        getName(user.username);
                        get_id(user.id);
                        }} >
                        <div>
                            <img src={user.profilePhoto? user.profilePhoto: defaultPic} alt={user && user.profilePhoto? user.name:"No profile photo"} />
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

    const applyPMessage = (message, success) => {
        if (success) {
          pmsg.current.style.color = 'green';
        } else {
          pmsg.current.style.color = 'red';
        }
        setPMsg(message);
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
              qloadingx.current.style.opacity = 0.6
              qloadingx.current.style.cursor = 'not-allowed';
              const userId = cookies.get('chatt_userId');
              axios.put('/users/update-bio',
              { quote },
              {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Token': cookie
                }
              })
                .then((response) => {
                  applyQMessage(`updated bio`, true);
                  setUser(response.data);
                  setTimeout(() => {
                    closeQuoteEdit();
                  }, 1500)
                })
                .catch((err) => {
                  if (err.response.status === 500) {
                    console.log(err.response.data);
                    applyQMessage('Network error, please try again later', false);
                  } else {
                    applyQMessage(`${err.response.data['error']}`, false);
                  }
                });
                setQLoading(false);
                qloading.current.style.opacity = 1
                qloading.current.style.cursor = 'pointer';
                qloadingx.current.style.opacity = 1
                qloadingx.current.style.cursor = 'pointer';
            }
        }
    }

    const updateUsername = (event) => {
        event.preventDefault();
        if (!uLoading) {
          const { username } = inputs;
  
          setUMsg("");
          if (!username) {
            applyUMessage("Please enter username", false)
          }  else {
              setULoading(!uLoading);
              uloading.current.style.opacity = 0.6
              uloading.current.style.cursor = 'not-allowed';
              uloadingx.current.style.opacity = 0.6
              uloadingx.current.style.cursor = 'not-allowed';
              axios.put('/users/update-username',
              { username },
              {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Token': cookie
                }
              })
                .then((response) => {
                  applyUMessage(`updated username`, true);
                  setUser(response.data);
                  setTimeout(() => {
                    closeNameEdit();
                  }, 1500)
                })
                .catch((err) => {
                  setULoading(false);
                  if (err.response.status === 500) {
                    console.log(err.response.data);
                    applyUMessage('Network error, please try again later', false);
                  } else {
                    applyUMessage(`${err.response.data['error']}`, false);
                  }
                });
              setULoading(false);
              uloading.current.style.opacity = 1
              uloading.current.style.cursor = 'pointer';
              uloadingx.current.style.opacity = 1
              uloadingx.current.style.cursor = 'pointer';
          }
        }
    }

    const cleanup = () => {
        URL.revokeObjectURL(image);
        imageRef.current.value = null;
    }

    const setImage = (newImage) => {
        if (image) {
            cleanup();
        }
        _setImage(newImage);
    }

    const uploadPhoto = (event) => {
        event.preventDefault();
        if (!pLoading) {
            const { file_profilephoto } = inputs;
            let objUrl;
            setPMsg("");

            try {
                objUrl = URL.createObjectURL(file_profilephoto);
            } catch {
                applyPMessage('please choose photo', false);
                return;
            }
            setImage(objUrl);

            const formData = new FormData();
            formData.append('file', file_profilephoto);
            formData.append('upload_preset', 'chattprofilephoto');
            let url;

            if (!file_profilephoto) {
                applyPMessage('Please choose photo, false');
            } else {
                setULoading(!pLoading);
                ploading.current.style.opacity = 0.6
                ploading.current.style.cursor = 'not-allowed';
                ploadingx.current.style.opacity = 0.6
                ploadingx.current.style.cursor = 'not-allowed';

                axios.post(
                    'https://api.cloudinary.com/v1_1/dd0lgcva4/image/upload',
                    formData
                )
                  .then((response) => {
                    url = response.data['secure_url'];
                    axios.put('/users/update-profile-photo', {
                        profilePhoto: url
                    }, {
                        headers: {
                            'X-Token': cookie,
                            'Content-Type': 'application/json'
                        }
                    })
                      .then((response) => {
                        applyPMessage(`uploaded profile photo`, true);
                        setUser(response.data);
                        setTimeout(() => {
                          closeUploadHandler();
                        }, 1500);
                      })
                      .catch((err) => {
                        if (err.response.status === 500) {
                          console.log(err.response.data);
                          applyPMessage('Network error, please try again later', false);
                        } else {
                          applyPMessage(`${err.response.data['error']}`, false);
                        }
                      });
                    setPLoading(false);
                    ploading.current.style.opacity = 1
                    ploading.current.style.cursor = 'pointer';
                    ploadingx.current.style.opacity = 1
                    ploadingx.current.style.cursor = 'pointer';
                  });
            }
        }
    }

    const uploadPhotos = (event) => {
        event.preventDefault();
        if (!pLoading) {
            const { file_profilephoto } = inputs;
            let objUrl;
            setPMsg("");

            try {
                objUrl = URL.createObjectURL(file_profilephoto);
            } catch {
                applyPMessage('please choose photo', false);
                return;
            }
            setImage(objUrl);

            const formData = new FormData();
            formData.append('file', file_profilephoto);
            formData.append('upload_preset', 'chattprofilephoto');
            let url;

            if (!file_profilephoto) {
                applyPMessage('Please choose photo, false');
            } else {
                setULoading(!pLoading);
                ploading.current.style.opacity = 0.6
                ploading.current.style.cursor = 'not-allowed';
                ploadingx.current.style.opacity = 0.6
                ploadingx.current.style.cursor = 'not-allowed';


                axios.post(
                    'https://api.cloudinary.com/v1_1/dd0lgcva4/image/upload',
                    formData
                )
                    .then((response) => {
                        url = response.data['secure_url'];
                        console.log(formData, url);
                        ploading.current.style.opacity = 1
                        ploading.current.style.cursor = 'pointer';
                        ploadingx.current.style.opacity = 1
                        ploadingx.current.style.cursor = 'pointer';
                    })
            }
        }
    }

    const openNameEdit = () => {
        if (UsernameRef) UsernameRef.current.style.display = 'none';
        if (usernameRef) usernameRef.current.style.display = 'none';
        if (usernameEditRef) usernameEditRef.current.style.display = 'flex';
        
    }

    const openQuoteEdit = () => {
        if (quoteRef) quoteRef.current.style.display = 'none';
        if (QuoteRef) QuoteRef.current.style.display = 'none';
        if (quoteEditRef) quoteEditRef.current.style.display = 'flex';
    }

    const closeNameEdit = () => {
        if (UsernameRef) UsernameRef.current.style.display = 'block';
        if (usernameRef) usernameRef.current.style.display = 'block';
        if (usernameEditRef) usernameEditRef.current.style.display = 'none';
        setUMsg("");
    }

    const closeQuoteEdit = () => {
        if (quoteRef) quoteRef.current.style.display = 'block';
        if (QuoteRef) QuoteRef.current.style.display = 'block';
        if (quoteEditRef) quoteEditRef.current.style.display = 'none';
        setQMsg("");
    }

    const openUploadHandler = () => {
        if (uploadBtn) uploadBtn.current.style.display = 'none';
        if (uploadHandler) uploadHandler.current.style.display = 'flex';
    }

    const closeUploadHandler = () => {
        if (uploadBtn) uploadBtn.current.style.display = 'block';
        if (uploadHandler) uploadHandler.current.style.display = 'none';
        setPMsg("");
    }

    const showFullPic = () => {
        if (user.profilePhoto) {
          if (smallProfilePic) smallProfilePic.current.style.display = 'none';
          if (bigProfilePic) bigProfilePic.current.style.display = 'block';
        }
    }

    const hideFullPic = () => {
        if (smallProfilePic) smallProfilePic.current.style.display = 'block';
        if (bigProfilePic) bigProfilePic.current.style.display = 'none';
    }

    useEffect(() => {
        // socket.disconnect();
    }, []);

    return (
        <>
            <section ref={sidebar} className='sidebar'>
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

                <div ref={searchWrapper} className='search-wrapper'>
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
                        setMessages={setMessages}
                        setState={setState}
                        setSearchInput={setInput}
                        socket={socket}/>
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
                    <div>
                        <img style={{ borderRadius: '50%', marginBottom: '5px' }} ref={smallProfilePic} src={user.profilePhoto ? user.profilePhoto : defaultPic} alt={user && user.profilePhoto? user.name:"No profile photo"} width={256} height={256} onClick={showFullPic} />
                    </div>
                    <div className='info'>
                        <div className='username-text' ref={UsernameRef}>{'@' + user.username}</div>
                        <div className='username-edit' ref={usernameRef} onClick={openNameEdit} ><ion-icon name="create-outline"></ion-icon></div>
                        <div>
                            <form name="updateUsernameForm" onSubmit={updateUsername}>
                                <div className='updateForm' ref={usernameEditRef}>
                                    <div className='username'>
                                        <input type="text" name="username" placeholder={user.username} value={inputs.username} onChange={handleEditChange} /></div>
                                    <div className='buttons' id="button" ref={uloading} type="submit" onClick={updateUsername}><ion-icon name="checkmark-outline"></ion-icon></div>
                                    <div className='buttons' id="cancel" ref={uloadingx} onClick={closeNameEdit} > <ion-icon name="close-outline" ></ion-icon></div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='message' ref={umsg}>{UMsg}</div>
                    <div className='info'>
                        <div className='quote-text' ref={QuoteRef}>{user.quote}</div>
                        <div className='quote-edit' ref={quoteRef} onClick={openQuoteEdit} ><ion-icon name="create-outline"></ion-icon></div>
                        <div>
                            <form name="updateQuoteForm" onSubmit={updateStatus}>
                                <div className='updateForm' ref={quoteEditRef}>
                                    <div className='quote'>
                                        <input type="text" name="quote" placeholder={user.quote} value={inputs.quote} onChange={handleEditChange} /></div>
                                    <div className='buttons' id="button" ref={qloading} type="submit" onClick={updateStatus}><ion-icon name="checkmark-outline"></ion-icon></div>
                                    <div className='buttons' id="cancel" ref={qloadingx} onClick={closeQuoteEdit} > <ion-icon name="close-outline" ></ion-icon></div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div clasName='message' ref={qmsg}>{QMsg}</div>
                    <div className='info'>
                        <div>{user.email}</div>
                    </div>
                    <div className='other-options'>
                        <form name="updateProfilePhotoForm">
                            <div className="update-profile-photo">
                                <div className='UpdateBtn' ref={uploadBtn} type="button" id="button" placeholder="Update profile photo" value={inputs.quote} onClick={openUploadHandler} >Update profile photo</div>
                                <div className="updateForm" ref={uploadHandler} >
                                    <div id='fileHolder'><input className='fileSelect' name="profilephoto" ref={imageRef} placeholder={'Click to select image'} value={inputs.profilephoto} onChange={handleEditChange} onClick={() => fileSelector.current.click()} /><input type='file' accept="image/*" name="profilephoto" ref={fileSelector} style={{ display: 'none', cursor: 'pointer'}} onChange={handleEditChange} /></div>
                                    <div id="Imagebutton" ref={ploading} type="submit" onClick={uploadPhoto}>Upload</div>
                                    <div id="Imagecancel" ref={ploadingx} onClick={closeUploadHandler} > Cancel </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='message' ref={pmsg}>{PMsg}</div>
                </div>
                <img className='full-pic' ref={bigProfilePic} src={user.profilePhoto ? user.profilePhoto : ''} alt={user && user.profilePhoto? user.name:"No profile photo"} onClick={hideFullPic}/>
            </div>
        </>
        );
}

export default Sidebar;