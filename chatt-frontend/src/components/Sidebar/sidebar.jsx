import './sidebar.scss';
import Navbar from '../Navbar/navbar';
import Messages from '../Messages/messsages'
import Pusher from 'pusher-js'
import axios from '../../axios'
import gsap from 'gsap';
import cookies from '../../cookies'
import { useEffect, useState, useRef} from 'react';
const defaultPic = '../../src/images/profile (1).png';

const Sidebar = () => {

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
                    setUser(response.data)
                })
                }, []);

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

    const getMessages = (id) => {
        const date = new Date()
        console.log(date.toLocaleTimeString('en-US'))
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
                }
                )
        )
    }


    return (
        <>
            <section className='sidebar'>
            <Navbar />
            <div className='chats'>
                <div className='menu'>
                    <input type="search" placeholder='Search or start a converstion '/>
                    <ion-icon name="search-outline"></ion-icon>
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

            </div>
            </section>
            <Messages messages={messages} user={user} other={other} setContainers={setContainers}/>
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