import {Schema, models, model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
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

ProjectSchema.plugin(mongooseAggregatePaginate);
ProjectSchema.plugin(uniqueValidator);

export default models.Project || model('Project', ProjectSchema)
