import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  campaignName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    default: 0
  },
  source: {
    type: String,
    required: true,
    enum: ['facebook', 'google', 'telegram', 'tiktok', 'instagram', 'organic', 'other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
