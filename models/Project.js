import mongoose, {Schema} from 'mongoose'
import User from './User.js';

const ProjectSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String
  }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
