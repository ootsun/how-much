import {Schema, models, model} from 'mongoose'
import User from './User.js';
import * as mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const OperationSchema = new Schema({
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
    required: true,
    trim: true,
  },
  implementationAddress: {
    type: String,
    trim: true,
  },
  functionName: {
    type: String,
    trim: true,
    required: true
  },
  methodId: {
    type: String,
    trim: true,
    required: true
  },
  minGasUsage: {
    type: Number
  },
  maxGasUsage: {
    type: Number
  },
  averageGasUsage: {
    type: Number
  },
  lastGasUsages: {
    type: [
      {
        txDate: {
          type: Date,
          default: Date.now,
        },
        value: Number,
      },
    ],
  },
});

OperationSchema.plugin(mongooseAggregatePaginate);
OperationSchema.index({ contractAddress: 1, functionName: 1 }, { unique: true });

export default models.Operation || model('Operation', OperationSchema)
