import {Schema, models, model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  avatarUrl: {
    type: String,
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  canEdit: {
    type: Boolean,
    default: false,
  }
});

export default models.User || model('User', UserSchema)
