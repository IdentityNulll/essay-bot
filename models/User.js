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
    default: 1
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
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;
