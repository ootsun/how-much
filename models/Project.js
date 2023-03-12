import {Schema, models, model} from 'mongoose';
import * as mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const ProjectSchema = new Schema({
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
    trim: true,
    unique: true,
  },
  symbol: {
    type: String,
    trim: true,
    sparse: true,
    uppercase: true
  },
  logoUrl: {
    type: String,
    trim: true,
    required: true,
  },
  isERC20: {
    type: Boolean,
    default: false,
  }
});

ProjectSchema.plugin(mongooseAggregatePaginate);

export default models.Project || model('Project', ProjectSchema)
