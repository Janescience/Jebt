import mongoose from 'mongoose';

const DebtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  type: {
    type: String,
    required: [true, 'Please provide a type'],
    enum: ['credit card', 'regular', 'cash'],
  },
  creditCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditCard',
  },
  detail: {
    type: String,
    maxlength: [500, 'Detail cannot be more than 500 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  flag: {
    type: String,
    required: [true, 'Please provide a flag'],
    enum: ['installment', 'paid full'],
  },
  month: {
    type: Number,
    required: [true, 'Please provide a month'],
  },
  year: {
    type: Number,
    required: [true, 'Please provide a year'],
  },
  currentPeriod: {
    type: Number,
    required: [true, 'Please provide a current period'],
  },
  allPeriod: {
    type: Number,
    required: [true, 'Please provide a all period'],
  },
  paid: {
    type: Number,
    required: [true, 'Please provide an amount paid'],
  },
  balance: {
    type: Number,
    required: [true, 'Please provide a balance'],
  },
  interest: {
    type: Number,
    required: [true, 'Please provide an interest rate'],
  },
  transactionDate: {
    type: Date,
    required: [true, 'Please provide a transaction date'],
  },
});

export default mongoose.models.Debt || mongoose.model('Debt', DebtSchema);
