import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  message: String,
  username: String,
  timestamp: String,
  senderId: String,
  containerId: String
});

export default mongoose.model('messages', MessageSchema);