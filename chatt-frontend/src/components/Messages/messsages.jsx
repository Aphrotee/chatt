import './messages.scss';

const Messages = () => {
    return (
        <section className='messages-wrapper'>
            <div className="user-nav">
                <div><img src='../../images/IMG_2130.JPG' alt="" /></div>
                <div className='calls'>
                    <ion-icon name="search-outline"></ion-icon>
                    <ion-icon name="camera-outline"></ion-icon>
                </div>
            </div>
            <div className='messages'>
                <div>
                    <div className='time-stamp'>12:34</div>
                    <div className='current-user'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas unde tenetur adipisci!cecilia
                    </div>
                    </div>
                    <div>
                    <div className='other-user'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit doloremque eius ex similique excepturi nam consectetur totam harum accusantium voluptas.
                    </div>
                    <div className='time-stamp'>12:43</div>
                </div>
            </div>

            <div className="search-bar">
                    <form action="" method="post">
                        <div className="icons">
                            <ion-icon name="happy-sharp"></ion-icon>
                            <ion-icon name="attach-sharp"></ion-icon>
                        </div>
                        <input type="search" name="" id="" />
                        <button type="button">
                            <ion-icon name="navigate-circle"></ion-icon>
                        </button>
                    </form>
            </div>
        </section>
        );

}

export default Messages;