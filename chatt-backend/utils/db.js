import mongoose from 'mongoose';
import pusher from './pusher.js';

export default () => {
  const connection_url = process.env.MONGO_URI;
  mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('DB connection established');
      /**const db = mongoose.connection;
      const messages = db.collection('messages');
      const changeStream = messages.watch();
      changeStream.on('change', (change) => {
        console.log('Change occured:', change);
        if (change.operationType === 'insert') {
          const messageDetails = change.fullDocument;
          pusher.trigger('messages', 'inserted',
            {
              name: messageDetails.name,
              message: messageDetails.message,
              timestamp: messageDetails.timestamp
            }
          );
        } else {
          console.log('Error triggering pusher');
        }
      });*/
    })
    .catch((err) => {
      console.log('DB encountered error:', err);
    }
  );
}