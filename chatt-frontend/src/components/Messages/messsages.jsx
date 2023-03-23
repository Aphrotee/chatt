import './messages.scss';

const Messages = ({ messages, user }) => {

    const display = () => {
        if (messages.length === 0) {
            return (
            <div className="empty">
                <div>
                    <img src="../../src/images/undraw_modern_life_re_8pdp.svg" alt="" srcset="" />
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
                    <div><img src="../../src/images/IMG_1445.JPG" alt="" /></div>
                    <div>
                        <p>Atabong Cecilia</p>
                        <p>Last seen 3:35pm </p>
                    </div>
                    <div>
                        <ion-icon name="call-outline"></ion-icon>
                    </div>
            </div>
            <div className='messages'>
            {messages.map((message) => {
            return (
            <div key={message._id} className={message.senderId === user.id ? 'current-user-wrapper': 'other-user-wrapper'}>
                <div>{message.message}</div>
                <div className='time-stamp'>{message.timestamp}</div>
            </div>)
            })}
            </div>
            <div className="search-bar">
                            <form action="" method="post">
                                <div className="icons">
                                    <ion-icon name="happy-outline"></ion-icon>
                                    <ion-icon name="attach-sharp"></ion-icon>
                                </div>
                                <input type="search" name="" id="" placeholder='Send a Message'/>
                                <button type="button">
                                    <ion-icon name="navigate-circle"></ion-icon>
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