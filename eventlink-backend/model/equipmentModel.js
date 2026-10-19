
const db = require('../config/db');

// Get all equipment and its category name
const getAllEquipment = async () => {
  const sql = `
    SELECT
      e.equipment_id,
      e.vendor_id,
      e.category_id,
      c.category_name,
      e.equipment_name,
      e.description,
      e.daily_price,
      e.quantity,
      e.image_url,
      e.status,
      e.created_at
    FROM equipment AS e
    LEFT JOIN categories AS c
      ON e.category_id = c.category_id
    ORDER BY e.equipment_id DESC
  `;

  const [rows] = await db.query(sql);
  return rows;
};

// Export the function for the controller
module.exports = { getAllEquipment };
