import mongoose from 'mongoose';

const MessageContainerSchema = mongoose.Schema({
  members: Array(mongoose.Types.ObjectId),
  membersUsernames: Array(String),
  numberOfMessages: Number,
  lastMessage: String,
  timestamp: Object,
  milliTimestamp: Number
});

export default mongoose.model('messagecontainers', MessageContainerSchema);