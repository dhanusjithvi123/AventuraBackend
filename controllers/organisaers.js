const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const organisaersModel = require("../models/organisaers");
const eventModel = require("../models/events");
const mongoose = require('mongoose');
const User = require("../models/user");
const Booking = require("../models/booking");


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
    const organisaers = await organisaersModel.find({ status: false});
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

const dashBoardDataGet = async (req, res) => {
  //month wise data
  // console.log(req.params);
  
  const { organisaerId } = req.params;
  // console.log("vvvvvvvvvvvvvvvvv" + organiserId);
  
  // const vendorId = req.params.id;


  //month wise data
  const FIRST_MONTH = 1
  const LAST_MONTH = 12
  const TODAY = new Date()
  const YEAR_BEFORE = new Date(TODAY)
  YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1)
  console.log(TODAY, YEAR_BEFORE)
  const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const pipeLine = [
    
  {
    $match: {
        createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }

    },
  },

  {
    $group: {
      _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.year_month": 1 }
  },
  {
    $project: {
      _id: 0,
      count: 1,
      month_year: {
        $concat: [
          { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
          "-",
          { $substrCP: ["$_id.year_month", 0, 4] }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      data: { $push: { k: "$month_year", v: "$count" } }
    }
  },
  {
    $addFields: {
      start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
      end_year: { $substrCP: [TODAY, 0, 4] },
      months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
      months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] }] }
    }
  },
  {
    $addFields: {
      template_data: {
        $concatArrays: [
          {
            $map: {
              input: "$months1",
              as: "m1",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] },
                    "-",
                    "$start_year"
                  ]
                }
              }
            }
          },
          {
            $map: {
              input: "$months2",
              as: "m2",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] },
                    "-",
                    "$end_year"
                  ]
                }
              }
            }
          }
        ]
      }
    }
  },
  {
    $addFields: {
      data: {
        $map: {
          input: "$template_data",
          as: "t",
          in: {
            k: "$$t.month_year",
            v: {
              $reduce: {
                input: "$data",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$t.month_year", "$$this.k"] },
                    { $add: ["$$this.v", "$$value"] },
                    { $add: [0, "$$value"] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  {
    $project: {
      data: { $arrayToObject: "$data" },
      _id: 0
    }
  }]
  const vendorPipeLine = [
    
 

  {
    $match: {
      organisaerId: new mongoose.Types.ObjectId(organisaerId),

        createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }

    },
  },

  {
    $group: {
      _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.year_month": 1 }
  },
  {
    $project: {
      _id: 0,
      count: 1,
      month_year: {
        $concat: [
          { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
          "-",
          { $substrCP: ["$_id.year_month", 0, 4] }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      data: { $push: { k: "$month_year", v: "$count" } }
    }
  },
  {
    $addFields: {
      start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
      end_year: { $substrCP: [TODAY, 0, 4] },
      months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
      months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] }] }
    }
  },
  {
    $addFields: {
      template_data: {
        $concatArrays: [
          {
            $map: {
              input: "$months1",
              as: "m1",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] },
                    "-",
                    "$start_year"
                  ]
                }
              }
            }
          },
          {
            $map: {
              input: "$months2",
              as: "m2",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] },
                    "-",
                    "$end_year"
                  ]
                }
              }
            }
          }
        ]
      }
    }
  },
  {
    $addFields: {
      data: {
        $map: {
          input: "$template_data",
          as: "t",
          in: {
            k: "$$t.month_year",
            v: {
              $reduce: {
                input: "$data",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$t.month_year", "$$this.k"] },
                    { $add: ["$$this.v", "$$value"] },
                    { $add: [0, "$$value"] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  {
    $project: {
      data: { $arrayToObject: "$data" },
      _id: 0
    }
  }]

  

 

  const packageChart = await eventModel.aggregate(vendorPipeLine);
    const orderChart = await Booking.aggregate(pipeLine);
    
    console.log(packageChart);
    console.log(orderChart);
    
    res.json({
        packageChart,
        orderChart,
 
  })

}


// const bookinggraph  = async (req, res, next) => {
//   try {
//     const {organisaerId } = req.params;
//     console.log(organisaerId+"hhhhhhhh");
//     const allBookings = await Booking.find({organisaerId}); // Retrieve all bookings from the database
//     res.json(allBookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


const dashboardData = async (req, res) => {
  try {
    console.log(req.params);
    const { organisaerId} = req.params;

    console.log("vvvvvvvvvvvvvvvvv" + organisaerId);

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
  dashBoardDataGet,
  // bookinggraph,
  dashboardData,
  edituser,
  updateUser,
  organisaerRequestList,
  verfiyconfrom,
   

};
