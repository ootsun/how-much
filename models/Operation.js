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
    required: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  functionName: {
    type: String,
    required: true
  },
  averageGasUsage: {
    type: Number
  }
});

OperationSchema.index({ contractAddress: 1, functionName: 1 }, { unique: true });

export default mongoose.models.Operation || mongoose.model('Operation', OperationSchema)
