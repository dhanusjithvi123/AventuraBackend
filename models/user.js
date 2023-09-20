const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },

  lastName: {
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
  status: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,

}
);

const User = mongoose.model("User", userSchema);

module.exports = User;