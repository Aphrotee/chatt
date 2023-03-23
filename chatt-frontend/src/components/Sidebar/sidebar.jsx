import './sidebar.scss';
import Navbar from '../Navbar/navbar';
import Messages from '../Messages/messsages'
import Pusher from 'pusher-js'
import axios from '../../axios'
import { useEffect, useState } from 'react';
const IMG1 = '../../src/images/IMG_1445.JPG';

const Sidebar = () => {


    const [containers, setCotainers] = useState([]);
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState(null)
    useEffect(() => {

                axios.get('/containers/all', {
                    headers: {
                        'X-Token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE3MjIxM2ZjNzJkNjBhNDg3ODBkNWYiLCJlbWFpbCI6ImNhdGFib25nODlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjZWNpbGlhIiwiaWF0IjoxNjc5NTEwOTg3LCJleHAiOjE2ODAxMTU3ODd9.IqVENLnwefh6yCF7fUr5dOQc09X7yrxA9Xh0W8-_2eU"
                    }
                }).then((response) => {

                setCotainers(response.data)
                })

                axios.get('/users/me', {
                    headers: {
                        'X-Token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE3MjIxM2ZjNzJkNjBhNDg3ODBkNWYiLCJlbWFpbCI6ImNhdGFib25nODlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjZWNpbGlhIiwiaWF0IjoxNjc5NTEwOTg3LCJleHAiOjE2ODAxMTU3ODd9.IqVENLnwefh6yCF7fUr5dOQc09X7yrxA9Xh0W8-_2eU"
                    }
                }).then((response) => {
                    setUser(response.data)
                })
                }, []);

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

    const getMessages = (id) => {
        axios.get(`/messages/${id}/all`, {
            headers: {
                'X-Token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE3MjIxM2ZjNzJkNjBhNDg3ODBkNWYiLCJlbWFpbCI6ImNhdGFib25nODlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjZWNpbGlhIiwiaWF0IjoxNjc5NTEwOTg3LCJleHAiOjE2ODAxMTU3ODd9.IqVENLnwefh6yCF7fUr5dOQc09X7yrxA9Xh0W8-_2eU"
            }
        }).then((response) => {
            setMessages(response.data)
        })
    }

    const userDisplay = () => {
        if (containers.length === 0) {
            return (
            <div className='noUser'>
                <p>You have no recent chats</p>
                <p>Search for users and start a conversation now</p>
            </div>)
        }

        return (
            containers.map((container) => {
                return (<div key={container._id} onClick={() => {getMessages(container._id)}}>
                    <div>
                        <img src={IMG1} alt="" />
                        <div className='notifications'>
                            <div>99</div>
                        </div>
                    </div>
                    <div className='details'>
                        <span>{container.name}</span>
                        <p>{container.lastMessage}</p>
                    </div>
                    <div className="timestamp">
                        <span>{container.timestamp}</span>
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
                            <img src={IMG1} alt="" />
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
        <Messages messages={messages} user={user}/>
        </>
        );
}

export default Sidebar;