class SocketIO {

    socketConnection (server) {
        this.io = require('socket.io')(server, {
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
module.exports = socketIO;