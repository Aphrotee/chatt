import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
});

export default mongoose.model('messages', MessageSchema);