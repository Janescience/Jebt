import mongoose from 'mongoose';

const CreditCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  dueDate: {
    type: Number,
  },
  finishDate: {
    type: Number,
  },
});

export default mongoose.models.CreditCard || mongoose.model('CreditCard', CreditCardSchema);
