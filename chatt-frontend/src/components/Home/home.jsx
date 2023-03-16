import Messages from "../Messages/messsages";
import Sidebar from "../Sidebar/sidebar";

const Home = () => {
    return (
        <main className="container">
            <Messages />
            <Sidebar />
        </main>
     );
}

export default Home;