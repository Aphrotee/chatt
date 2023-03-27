import { socketio } from 'socket.io';

class SocketIO {

    socketConnection (server) {
        this.io = socketio(server, {
            pingTimeout: 60000,
            cors: {
                origin: '0.0.0.0/0'
            }
        });
        this.io.on('connection', (socket) => {
            console.log('Connected to socket');
        })
    }
}

const socketIO = new SocketIO();
export default socketIO;