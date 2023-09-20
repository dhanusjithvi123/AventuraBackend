const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");
const eventModel = require("../models/events")
const sendVerifyEmail = require("../service/nodemailer");

let storeotp ;
let otp = null; // Define otp variable
const register = async (req, res, next) => {
  try {
   
    const { firstName, lastName, phone, email, password, address } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      phone,
      email,
      address,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp");
    console.log(otp);

    // Store the OTP in a variable accessible to the verification endpoint
     storeotp = otp;

    // Send OTP via email
    await sendVerifyEmail(email, otp);

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

const verifyUser = async (req, res, next) => {
  try {
;

    const { otp } = req.body;
 console.log(storeotp+"storr");

    if (otp == storeotp) {
      // OTP is valid and matches
      console.log("OTP matched: success");
      res.json({ message: 'success' });   
    } else {
      // OTP is invalid or doesn't match
      console.log("OTP mismatched: failure");
      res.json({ message: 'failure' });
    }
  } catch (error) {
    next(error);
  }
};


const user = async (req, res, next) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization.split('Bearer ')[1];

    // Verify the token
    const claims = jwt.verify(token, "secret");

    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }

    const user = await User.findOne({ _id: claims._id });

    // Check if the user is blocked
    if (user.status === true) {
      return res.status(403).send({
        message: "Access denied. User is blocked.",
      });
    }

    const { firstName, password, ...data } = await user.toJSON();

    res.send({ firstName, ...data });
  } catch (err) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
};



const logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "Incorrect password",
    });
  }

  if (user.status==true) {
    return res.status(403).send({
      message: "Access denied. User is blocked.",
    });
  }

  const token = jwt.sign({ _id: user._id }, "secret");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 100000,
  });

  res.send({
    userId: user._id,
    token: token,
    message: "Success",
  });
};



const emailentering = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  if (user.status==true) {
    return res.status(403).send({
      message: "Access denied. User is blocked.",
    });
  }

  const token = jwt.sign({ _id: user._id }, "secret");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 100000,
  });

  res.send({
    userId: user._id,
    message: "Success",
  });
};






const usersList = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const edituser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    console.log("enterrr");
    const userId = req.params.id;
    const updatedUser = req.body;

    const user = await User.findOneAndUpdate({ _id: userId }, updatedUser, {
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


const newpassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newPassword = req.body.password; // Assuming the new password is sent in the request body

    // Hash the new password before updating it in the database
    const hash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hash }, // Update the password field with the hashed password
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }
   
    res.json({ success: 1, message: "Password updated successfully" });
    
  } catch (error) {
    next(error);
  }
};




const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: 1, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const userlogin = async (req, res) => {
 

  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return res.status(404).send({
      message: "User not found",
    });
  }
  if (!(await bcrypt.compare(req.body.password, admin.password))) {
    return res.status(400).send({
      message: "Incorrect password",
    });
  }

  const token = jwt.sign({ _id: admin._id }, "secret");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 100000,
  });

  res.send({
    message: "Success",
  });
};


const blocking = async (req, res, next) => {

  const { userId } = req.params;
  const { status } = req.body;


  try {
    // Find the organizer by ID and update the status
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status } },
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

const booking = async (req, res, next) => {
  try {
    const event = await eventModel.findOne({ _id: req.params.id }).populate("organisaerId");

    console.log("enterr"+event);
    res.json(event);
  } catch (error) {
    next(error);
  }
};








module.exports = {
  register,
  user,
  logout,
  login,
  usersList,
  edituser,
  updateUser,
  deleteUser,
  userlogin,
  verifyUser,
  blocking,
  booking,
  emailentering,
  newpassword,
 
 
};
