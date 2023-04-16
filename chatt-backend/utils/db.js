import mongoose from 'mongoose';
// import pusher from './pusher.js';

class DBClient {
  constructor () {
    this.alive = true;
    this.dbConnection = null;
  }

  connectDB(io) {
    const connection_url = process.env.MONGO_URI;
    mongoose.connect(connection_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        this.alive = true;
        console.log('DB connection established');
        const db = mongoose.connection;
        io.disconnectSockets();
        io.on('connection', (socket) => {
          console.log('Connected to socket');
          socket.emit('connected to socket');
          socket.on('user connect', (userId) => {
            socket.join(userId);
            console.log('user connected', userId);
            socket.emit('user connected', userId);
          });

          // connection check
          socket.on('Hey server', () => {
            socket.emit('Hi client');
          })

          const emitTyping = (data) => {
            socket.emit('is typing', data);
            socket.in(data.sender).emit('is typing', data);
            socket.in(data.receiver).emit('is typing', data);
          }

          const emitStopTyping = (data) => {
            socket.emit('is not typing', data);
            socket.in(data.sender).emit('is not typing', data);
            socket.in(data.receiver).emit('is not typing', data);
          }
    
          // socket.off('user connect');
          socket.on('open container', (containerId) => {
            socket.join(containerId);
            console.log('user opened container', containerId);
          });
          socket.on('typing', (data) => {
            emitTyping(data);
            console.log(`${data.sender} is typing in ${data.container}`);
          });
          socket.on('not typing', (data) => {
            emitStopTyping(data);
            console.log(`${data.sender} stopped typing in ${data.container}`);
          });
          const messages = db.collection('messages');
          const messagecontainers = db.collection('messagecontainers');
          const messageChangeStream = messages.watch();
          const msgContChangeStream = messagecontainers.watch();
          messageChangeStream.on('change', (change) => {
            if (change.operationType === 'insert') {
              const messageDetails = change.fullDocument;
              const container = messageDetails.containerId;
              socket.emit('new message', messageDetails);
              console.log('new message emitted');
            }
          });
          msgContChangeStream.on('change', async (change) => {
            if (change.operationType === 'update') {
              // const containerDetails = change.updateDescription.updatedFields;
              const id = change.documentKey._id;
              const { default: MessageContainerController } = await import('../models/MessageContainers.js');
              MessageContainerController.findById(new mongoose.Types.ObjectId(id))
                .then((container) => {
                  const members = container.members;
                  console.log('emitting update in container:', container._id.toString());
                  socket.emit('container updated', { members, container });
                })
            }
          });

          socket.off('user connect', (userId) => {
            console.log('user diconnected');
            socket.leave(userId);
          })
        });
        // this.dbConnection = db;
        // const messages = db.collection('messages');
        // const messagecontainers = db.collection('messagecontainers');
        // const messageChangeStream = messages.watch();
        // const msgContChangeStream = messagecontainers.watch();
        // messageChangeStream.on('change', (change) => {
        //   // console.log('Change occured:', change);
        //   if (change.operationType === 'insert') {
        //     const messageDetails = change.fullDocument;
        //     pusher.trigger('messages', 'inserted',
        //       {
        //         username: messageDetails.username,
        //         message: messageDetails.message,
        //         timestamp: messageDetails.timestamp,
        //         receiverId: messageDetails.receiverId,
        //         containerId: messageDetails.containerId
        //       }
        //     )
        //       .catch((err) => {
        //         console.log('Error triggering pusher:', err);
        //       });
        //   }
        // });
        // /**msgContChangeStream.on('change', (change) => {
        //   console.log('Change occured:', change);
        //   if (change.operationType === 'update') {
        //     const containerDetails = change.updateDescription.updatedFields;
        //     pusher.trigger('messagecontainers', 'updated',
        //     {
        //       id: change.documentKey._id,
        //       lastMessage: containerDetails.lastMessage,
        //       timestamp: containerDetails.timestamp
        //     })
        //   }
        // })*/
      })
      .catch((err) => {
        this.alive = false;
        console.log('DB encountered error:', err);
      }
    );
  }

  isAlive() {
    return this.alive;
  }
}

const DB = new DBClient();
export default DB;