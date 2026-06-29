import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    default: ''
  },
  selectedLanguage: {
    type: String,
    default: null
  },
  creditCount: {
    type: Number,
    default: 2
  },
  essaysCount: {
    type: Number,
    default: 0
  },
  currentState: {
    type: String,
    default: 'START'
  },
  // Temporary state storage for essay processing flow
  tempQuestionText: {
    type: String,
    default: null
  },
  tempQuestionPhotoId: {
    type: String,
    default: null
  },
  tempSelectedPackage: {
    type: String,
    default: null
  },
  // Bonus/Referral program fields
  promoCode: {
    type: String,
    default: null
  },
  promoCodeCount: {
    type: Number,
    default: 0
  },
  usedPromoCode: {
    type: String,
    default: null
  },
  receivedBonusDiscount: {
    type: Boolean,
    default: false
  },
  // Progress report caching
  cachedProgressReport: {
    type: String,
    default: null
  },
  progressReportGeneratedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;
