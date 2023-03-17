import './sidebar.scss';
import Navbar from '../Navbar/navbar';
const IMG1 = '../../src/images/IMG_1445.JPG';
const IMG2 = '../../src/images/IMG_2130.JPG';

const Sidebar = () => {
    return (
        <section className='sidebar'>
            <Navbar />
            <div className='chats'>
                <div className='menu'>
                    <input type="search" />
                    <ion-icon name="search-outline"></ion-icon>
                </div>

                <div className='chats-wrapper'>
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
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                        <div className='details'>
                            <span>Aprohtee</span>
                            <p>This is the last time it is</p>
                        </div>
                        <div className="timestamp">
                            <span>3:45</span>
                        </div>
                    </div>
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                            <div className='details'>
                                <span>Aprohtee</span>
                                <p>This is the last time it is</p>
                            </div>
                            <div className="timestamp">
                                <span>3:45</span>
                            </div>
                    </div>
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                            <div className='details'>
                                <span>Aprohtee</span>
                                <p>This is the last time it is</p>
                            </div>
                            <div className="timestamp">
                                <span>3:45</span>
                            </div>
                    </div>
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                            <div className='details'>
                                <span>Aprohtee</span>
                                <p>This is the last time it is</p>
                            </div>
                            <div className="timestamp">
                                <span>3:45</span>
                            </div>
                    </div>
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                            <div className='details'>
                                <span>Aprohtee</span>
                                <p>This is the last time it is</p>
                            </div>
                            <div className="timestamp">
                            <span>3:45</span>
                            </div>
                    </div>
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                            <div className='details'>
                                <span>Aprohtee</span>
                                <p>This is the last time it is</p>
                            </div>
                            <div className="timestamp">
                                <span>3:45</span>
                            </div>
                    </div>
                    <div>
                        <div><img src={IMG2} alt="" /></div>
                            <div className='details'>
                                <span>Aprohtee</span>
                                <p>This is the last time it is</p>
                            </div>
                            <div className="timestamp">
                                <span>3:45</span>
                            </div>
                    </div>
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
        );

}

export default Sidebar;