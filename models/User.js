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
    uniqueCaseInsensitive: true,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
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

UserSchema.plugin(uniqueValidator);

export default models.User || model('User', UserSchema)
