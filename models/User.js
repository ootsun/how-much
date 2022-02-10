import mongoose, {Schema} from 'mongoose'

const UserSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
  },
  address: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema)
