const CategoryModel = require("../models/category");

const Categoryadding = async (req, res, next) => {
    try {
      const { Category } = req.body;
  
      // Check if the category name already exists in the database
      const existingCategory = await CategoryModel.findOne({
        Category: { $regex: `^${Category}$`, $options: "i" },
      });
  
      if (existingCategory) {
        // Category name already exists
        return res.status(400).json({ message: "Category already exists" });
      }
  
      // Create a new event
      const newCategory = new CategoryModel({
        Category,
      });
  
      // Save the event to the database
      const savedCategory = await newCategory.save();
  
      // Send success response
      res.json({ message: "success" }); // Return the saved event ID to the client if needed
    } catch (error) {
      // Handle error
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  };


  const categorylist = async (req, res, next) => {
    try {
      const category = await CategoryModel.find();
  
      res.status(200).json({ category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  


module.exports = {
    Categoryadding,
    categorylist,
   
  };
  