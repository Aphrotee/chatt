import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String
});

export default mongoose.model('users', UserSchema);