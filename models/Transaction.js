import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['PACKAGE_PURCHASE', 'BONUS_CREDIT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  creditsReceived: {
    type: Number,
    required: true
  },
  packageType: String,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'FAILED'],
    default: 'PENDING'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ status: 1, timestamp: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
