import './messages.scss';

const Messages = () => {
    return (
            <section className='messages-wrapper'>
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
                    <div>
                        <div className='time-stamp'>12:34</div>
                        <div className='current-user'>
                        Lorem ipsum
                        </div>
                        </div>
                        <div>
                        <div className='time-stamp'>12:43</div>
                        <div className='other-user'>
                           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur molestiae recusandae eaque soluta quis, eveniet blanditiis rem aperiam porro quo beatae ut neque aut ea iste tempore nesciunt expedita optio officiis repellat. Libero a, repudiandae saepe modi aliquam fuga commodi cumque itaque! Enim debitis, facilis, dolores esse fuga a illum error earum molestiae quis sapiente, voluptatem vel unde? Recusandae repellendus consequuntur, optio impedit in ducimus cupiditate, nemo blanditiis, similique explicabo temporibus adipisci labore dolore vel exercitationem ipsum dignissimos debitis possimus velit. Velit recusandae in obcaecati eveniet ad maxime, tenetur possimus assumenda corrupti, asperiores rem quibusdam cumque animi ut! Explicabo, amet.
                        </div>
                    </div>
                </div>
                <div className="search-bar">
                        <form action="" method="post">
                            <div className="icons">
                                <ion-icon name="happy-outline"></ion-icon>
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