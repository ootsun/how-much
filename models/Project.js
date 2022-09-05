import mongoose, {Schema} from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';

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
    required: true,
    unique: true
  },
  symbol: {
    type: String,
    unique: true
  },
  logoUrl: {
    type: String,
    required: true,
  },
  isERC20: {
    type: Boolean,
    default: false,
  }
});

ProjectSchema.plugin(uniqueValidator);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
