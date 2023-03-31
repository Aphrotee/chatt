import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  profilePhoto: String,
  password: String,
  quote: String
});

export default mongoose.model('users', UserSchema);