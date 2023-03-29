import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  message: String,
  type: String,
  username: String,
  timestamp: Object,
  milliTimestamp: Number,
  senderId: mongoose.Types.ObjectId,
  receiverId: mongoose.Types.ObjectId,
  containerId: mongoose.Types.ObjectId,
  dummyId: String
});

export default mongoose.model('messages', MessageSchema);