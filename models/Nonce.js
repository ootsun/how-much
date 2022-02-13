import mongoose, {Schema} from 'mongoose'

const NonceSchema = new mongoose.Schema({
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

export default mongoose.models.Nonce || mongoose.model('Nonce', NonceSchema)
