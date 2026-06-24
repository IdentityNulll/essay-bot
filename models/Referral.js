import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: String,
    required: true,
    index: true
  },
  referredUserId: {
    type: String,
    required: true,
    index: true
  },
  referralCode: {
    type: String,
    required: true,
    index: true
  },
  conversionStatus: {
    type: String,
    enum: ['PENDING', 'FIRST_ESSAY', 'PURCHASED'],
    default: 'PENDING'
  },
  conversionValue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
