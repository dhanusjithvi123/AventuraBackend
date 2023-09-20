const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const organisaersModel = require("../models/organisaers");
const eventModel = require("../models/events");
const mongoose = require('mongoose');
const User = require("../models/user");
const Booking = require("../models/booking");
const Admin = require("../models/admin");


const register = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password, address, companyName } = req.body;

    // Check if email is already taken
    const existingUser = await organisaersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new organisaersModel({
      firstName,
      lastName,
      phone,
      companyName,
      email,
      address,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ _id: savedUser._id }, "secret");

    // Set the token as a cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 100000,
    });

    // Send success response
    res.json({ message: "success" });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};



const organisaerlogin = async (req, res) => {
  try {
    const organiser = await organisaersModel.findOne({ email: req.body.email });

    const admin = await Admin.findOne({ email: "dhanusjith@gmail.com"});

    if (!organiser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (!(await bcrypt.compare(req.body.password, organiser.password))) {
      return res.status(400).send({
        message: "Incorrect password",
      });
    }

    if (organiser.verfiy==false) {
      return res.status(403).send({
        message: "Admin Not Approved",
      });
    }


    if (organiser.status==true) {
      return res.status(403).send({
        message: "Access denied. User is blocked.",
      });
    }

    const token = jwt.sign({ _id: organiser._id }, "secret");

    res.send({
      token: token,
      userId: organiser._id,
      adminId: admin._id,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};



const rent = async (req, res, next) => {
  try {
   
    const { paymentId, token } = req.body; // Retrieve the paymentId and token from the request body
    
  
    // Extract the user ID from the token
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;

    // Continue with your logic using the paymentId, token, and userId

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

const organisaerList = async (req, res, next) => {
  try {
    const organisaers = await organisaersModel.find();
    res.json(organisaers);
  } catch (error) {
    next(error);
  }
};

const organisaerRequestList = async (req, res, next) => {
  try {
    const organisaers = await organisaersModel.find({verfiy: false});
    res.json(organisaers);
  } catch (error) {
    next(error);
  }
};


const userorganisaerList = async (req, res, next) => {
  try {
    const organisaers = await organisaersModel.find({ verfiy: true});
    console.log(organisaers);
    res.json(organisaers);
  } catch (error) {
    next(error);
  }
};





const blocking = async (req, res, next) => {
 
  const { organiserId } = req.params;
  const { status } = req.body;



  try {
    // Find the organizer by ID and update the status
    const organizer = await organisaersModel.findByIdAndUpdate(
      organiserId,
      { $set: { status } },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    // Return the updated organizer
    res.json(organizer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}



const Requests = async (req, res, next) => {
 
  const { organiserId } = req.params;
  const { Request } = req.body;



  try {
    // Find the organizer by ID and update the status
    const organizer = await organisaersModel.findByIdAndUpdate(
      organiserId,
      { $set: { Request} },
      { new: false }
    );

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    // Return the updated organizer
    res.json(organizer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}







const dashboardData = async (req, res) => {
  try {
   
    const { organisaerId} = req.params;

  

    // Get total order amount
    const orderTotal = await Booking.aggregate([
      { $match: { organiserId: new mongoose.Types.ObjectId(organisaerId) } },
    ]);

    // Get total package count
    const packageTotal = await eventModel.countDocuments({ organisaerId });

    // Get total order count
    const totalOrders = await Booking.countDocuments({ organisaerId });

    const data = {
      totalPackage: packageTotal,
      totalCurrency: orderTotal.length > 0 ? orderTotal[0].total : 0,
      totalOrders,
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving dashboard data" });
  }
};


const edituser = async (req, res, next) => {
  try {
    const Organiser = await organisaersModel.findOne({ _id: req.params.id });

    console.log(Organiser);
    res.json(Organiser);
  } catch (error) {
    next(error);
  }
};


const updateUser = async (req, res, next) => {
  try {
    console.log("enterrr");
    const organiserId = req.params.id;
    const updatedUser = req.body;

    const user = await organisaersModel.findOneAndUpdate({ _id: organiserId}, updatedUser, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }

    user.block=true;

    res.json({ success: 1, message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};

const verfiyconfrom = async (req, res, next) => {

  const { organiserId } = req.params;
  const { verfiy } = req.body;
console.log("Enter");

  try {
    // Find the organizer by ID and update the status
    const user = await organisaersModel.findByIdAndUpdate(
      organiserId,
      { $set: { verfiy } },
      { new: true }
    );

 
    if (!user ) {
      return res.status(404).json({ error: 'user  not found' });
    }

    // Return the updated organizer
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}


module.exports = {
  register,
  organisaerlogin,
  organisaerList,
  rent,
  blocking,
  userorganisaerList,
  // dashBoardDataGet,
  // bookinggraph,
  dashboardData,
  edituser,
  updateUser,
  organisaerRequestList,
  verfiyconfrom,
   

};
