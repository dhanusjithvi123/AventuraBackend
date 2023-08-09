const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    Category: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model("Category", categorySchema);
