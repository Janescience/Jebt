import mongoose from 'mongoose';

const RegularSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  detail: {
    type: String,
    maxlength: [500, 'Detail cannot be more than 500 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  user: {
    type: String,
    required: [true, 'Please provide a user'],
  },
});

export default mongoose.models.Regular || mongoose.model('Regular', RegularSchema);
