import mongoose from 'mongoose';

const essaySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      ref: 'User'
    },
    questionText: String,
    essayText: {
      type: String,
      required: true
    },
    source: {
      type: String,
      enum: ['text', 'pdf', 'docx', 'image'],
      default: 'text'
    },
    wordCount: Number,
    geminiReport: mongoose.Schema.Types.Mixed,
    bandScores: {
      writing: Number,
      grammar: Number,
      lexicon: Number,
      coherence: Number
    },
    finalBand: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      enum: ['essay', 'letter'],
      default: 'essay'
    },
    processingTime: Number,
    language: {
      type: String,
      enum: ['en', 'uz', 'ru'],
      default: 'en'
    }
  },
  { timestamps: true }
);

const Essay = mongoose.model('Essay', essaySchema);
export default Essay;
