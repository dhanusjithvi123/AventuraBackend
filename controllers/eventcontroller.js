const organisaersModel = require("../models/organisaers");
const eventModel = require("../models/events");
const bookedModel = require("../models/booking");
const mongoose = require("mongoose");

const eventadding = async (req, res, next) => {
  try {
    const { eventName, eventRate, phone, features } = req.body;
    const { path, filename } = req.file;
    const organisaerId = req.params.organisaerId; // Assuming the ID is passed as a route parameter

    // Create a new event
    const newEvent = new eventModel({
      organisaerId: new mongoose.Types.ObjectId(organisaerId), // Use 'new' when creating ObjectId
      eventName,
      eventRate,
      features,
      phone,
      image: {
        public_id: filename,
        url: path,
      },
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();

    // Send success response
    res.json({ message: "success" }); // Return the saved event ID to the client if needed
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const eventlist = async (req, res, next) => {
  
  const { organisaerId } = req.params;
  try {
    const events = await eventModel.find({ organisaerId });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



const eventlistchart = async (req, res, next) => {
  const { organisaerId } = req.params;
  console.log("ENTERR");
  try {
    const events = await eventModel.find({ organisaerId });

    // Extract and concatenate all 'createdAt' values into one array
    const createdAtValues = [].concat(...events.map(event => event.createdAt));
console.log(createdAtValues);
    res.status(200).json({ createdAt: createdAtValues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



const editevent = async (req, res, next) => {
  try {
    const event = await eventModel.findOne({ _id: req.params.id });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const updateevent = async (req, res, next) => {

  try {
    const eventId = req.params.id;
    const updatedEvent = req.body;

    const event = await eventModel.findOneAndUpdate(
      { _id: eventId },
      updatedEvent,
      {
        new: true,
      }
    );

    if (!event) {
      // Fix variable name from 'user' to 'event'
      return res.status(404).json({ success: 0, message: "Event not found" });
    }

    event.block = true; // Assuming you meant to update the 'block' property of the event, otherwise, modify accordingly

    res.json({ success: 1, message: "Event updated successfully", event }); // Fix variable name from 'user' to 'event'
  } catch (error) {
    next(error);
  }
};

const usereventlist = async (req, res, next) => {
  try {
    const events = await eventModel.find({ status: false }).populate("organisaerId");
  
    res.json(events);
  } catch (error) {
    next(error);
  }
};




const eventblocking = async (req, res, next) => {

  const eventId = req.params.id; // Corrected parameter name
  const { status } = req.body;

  try {
    // Find the event by ID and update the status
    const event = await eventModel.findByIdAndUpdate(
      eventId,
      { $set: { status } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Return the updated event
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};






module.exports = {
  eventadding,
  eventlist,
  editevent,
  updateevent,
  usereventlist,
  eventblocking,
  eventlistchart,

};
