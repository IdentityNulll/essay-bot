import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: [
      'USER_STARTED_BOT',
      'FIRST_ESSAY_SUBMITTED',
      'SECOND_ESSAY_SUBMITTED',
      'PAYMENT_PAGE_VIEWED',
      'PACKAGE_PURCHASED',
      'REFERRAL_GENERATED'
    ],
    required: true
  },
  campaignId: {
    type: String,
    default: null,
    index: true
  },
  referralSource: {
    type: String,
    default: null
  },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

eventLogSchema.index({ userId: 1, timestamp: -1 });
eventLogSchema.index({ eventType: 1, timestamp: -1 });

const EventLog = mongoose.model('EventLog', eventLogSchema);
export default EventLog;
