import mongoose, {Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

UserSchema.plugin(uniqueValidator);

export default mongoose.models.User || mongoose.model('User', UserSchema)
