const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    eventId: {
      type: ObjectId,
      ref: "Event",
    },
 
    organisaerId: {
      type: ObjectId,
      ref: "organisaers",
    },

    orderId:{
        type :String,
    },
    Status: {
      type: String,
      default: "pending",
    },
    paymentStatus: {
      type: String,
    },

    eventPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    Qtystatus: {
      type: Boolean,
      default: true,
    },
    deliveredAt: {
      type: Date,
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    state: {
      type: String,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },

    code: {
      type: Number,
    },
    mobile: {
      type: Number,
    },
    useraddress: {
      type: String,
    },

    paymentMethod: { type: String },

    order_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("booking", bookSchema);
module.exports = order;
