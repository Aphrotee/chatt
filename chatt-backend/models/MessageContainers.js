import mongoose from 'mongoose';

const MessageContainerSchema = mongoose.Schema({
  members: Array(String),
  numberOfMessages: Number,
  lastMessage: String,
  timestamp: String
});

export default mongoose.model('messagecontainers', MessageContainerSchema);