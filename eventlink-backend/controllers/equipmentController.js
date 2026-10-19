
const equipmentModel = require('../model/equipmentModel');

// Handle the request to get all equipment
const getAllEquipment = async (req, res) => {
  try {
    const equipment = await equipmentModel.getAllEquipment();

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    console.error('Error fetching equipment:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve equipment'
    });
  }
};

// Export the controller function
module.exports = { getAllEquipment };
