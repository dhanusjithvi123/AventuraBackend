const mongoose = require("mongoose");

const organisaerSchema = new mongoose.Schema({

  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  companyName: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },

  rent :{
    type:Boolean,
    default: false,
  },

 verfiy :{
    type:Boolean,
    default: false,
  },
},
{
  timestamps: true,

});

module.exports = mongoose.model("organisaers", organisaerSchema);
