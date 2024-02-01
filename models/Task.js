const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, 'Please provide position'],
    },
    status: {
      type: String,
      enum: ['finished', 'pending'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },

  },
  { timestamps: true }
)

module.exports = mongoose.model('Dio-Task', TaskSchema)
