
const categoryModel = require("../model/categoryModel");

// Handle requests to get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
    });
  }
};

// Export the controller function
module.exports = {
  getAllCategories,
};
