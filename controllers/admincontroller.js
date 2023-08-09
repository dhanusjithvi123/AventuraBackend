const { Router } = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const Admin = require("../models/admin");


const adminlogin = async (req, res) => {
  try {
    console.log("hii");
    console.log(req.body.email);
    const admin = await Admin.findOne({ email: req.body.email });
    console.log(admin);
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

    res.send({
      token: token,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};


const logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
};




  module.exports = {
    adminlogin,
    logout,
  };