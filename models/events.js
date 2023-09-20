const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const eventSchema = mongoose.Schema(
  {
    organisaerId: {
      type: ObjectId,
      ref: 'organisaers',
    },
    eventName: {
      type: String,
      require: true,
    },
    isBooked: {
      type: Boolean,
      default: false, // Default value is set to false (not booked)
    },
    eventRate: {
      type: Number,
      require: true,
    },
    features: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: Boolean,
      default: false,
    },
    image: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
