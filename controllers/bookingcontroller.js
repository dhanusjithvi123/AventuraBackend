const organisaersModel = require("../models/organisaers");
const bookedModel = require("../models/booking");
const mongoose = require("mongoose");
const eventModel = require("../models/events");
const Razorpay = require("razorpay");

const submit_booking = async (req, res) => {
  try {
    console.log(req.body);
    const { eventRate, orderId } = req.body;

    // Convert eventPrice to paise by multiplying it with 100
    const amountInPaise = eventRate * 100;

    const razorpayInstance = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });

    const options = {
      receipt: orderId,
      amount: amountInPaise, // Use the amount in paise
      currency: "INR",
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      throw new Error("Failed to create order");
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const paymetcomformsend = async (req, res, next) => {
  try {
    console.log("req.body", req.body);

    const {
      name,
      email,
      mobile,
      useraddress,
      eventId,
      organisaerId,
      userId,
      orderId,
    } = req.body;

    // Create a new instance of bookedModel
    const newBooking = new bookedModel({
      name,
      email,
      mobile,
      useraddress,
      eventId,
      organisaerId,
      userId,
      orderId,
    });

    // Save the new booking document to the database
    const savedBooking = await newBooking.save();

    // Update the event's isBooked property to true
    const event = await eventModel.findByIdAndUpdate(
      eventId,
      { $set: { isBooked: true } }, // Set isBooked to true after booking
      { new: true }
    );

    console.log("Saved booking:", savedBooking);

    // Send a response back to the client if needed
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    next(error);
  }
};

const bookedlist = async (req, res, next) => {
  const { organisaerId } = req.params;
  try {
    const bookedlist = await bookedModel.find({ organisaerId });

    res.status(200).json({ bookedlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const userbookedlist = async (req, res, next) => {
  console.log("enter");
  const { userId } = req.params;
  try {
    const bookedlist = await bookedModel.find({ userId })
      .populate('eventId')         // Populate the event details
      .populate('organisaerId');    // Populate the organizer details

    console.log(bookedlist);
    res.status(200).json({ bookedlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const checkBookingStatus = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const event = await bookedModel.findById(eventId);

    if (!event) {
      // Event not found
      return res.status(404).json({ message: "Event not found" });
    }

    const isBooked = event.isBooked || false;
    res.json(isBooked);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const cancelBookingStatus = async (req, res, next) => {
  const { bookingId } = req.params;
  
  try {
    // Update the status of the booking to "cancelled" in the database
    // For example, if you're using Mongoose:
    const updatedBooking = await bookedModel.findByIdAndUpdate(
      bookingId,
      { Status: 'cancelled' },
      { new: true }
    );

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error cancelling booking' });
  }
};


const changeisbookig = async (req, res, next) => {
  const { bookingId } = req.params;
  
  try {
    // Update the status of the booking to "cancelled" in the database
    // For example, if you're using Mongoose:
    const updatedBooking = await bookedModel.findByIdAndUpdate(
      bookingId,
      { Status: 'cancelled' },
      { new: true }
    );

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error cancelling booking' });
  }
};






module.exports = {
  submit_booking,
  paymetcomformsend,
  bookedlist,
  userbookedlist,
  checkBookingStatus,
  cancelBookingStatus,
};
