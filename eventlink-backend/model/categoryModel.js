
const db = require("../config/db");

// Get all categories from the database
const getAllCategories = async () => {
  const sql = `
    SELECT category_id, category_name, description
    FROM categories
    ORDER BY category_id DESC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

// Export the function for the controller
module.exports = {
  getAllCategories,
};
