import mongoose, {Schema} from 'mongoose'
import User from './User.js';

const OperationSchema = new mongoose.Schema({
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
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  contractAddress: {
    type: String,
  },
  functionName: {
    type: String,
    required: true
  },
  averageGasUsage: {
    type: Number
  }
});

export default mongoose.models.Operation || mongoose.model('Operation', OperationSchema)
