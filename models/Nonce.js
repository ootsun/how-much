import {Schema, models, model} from 'mongoose'

const NonceSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  value: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

export default models.Nonce || model('Nonce', NonceSchema)
