
const db = require("../config/db");

// Find a user by email
const findUserByEmail = async (email) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [email]);
  return rows[0] || null;
};

// Create a new user
const createUser = async (user) => {
  const sql = `
    INSERT INTO users (
      full_name,
      email,
      password_hash,
      phone,
      role,
      business_name,
      business_description,
      business_address,
      verification_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user.full_name,
    user.email,
    user.password_hash,
    user.phone,
    user.role,
    user.business_name,
    user.business_description,
    user.business_address,
    user.role === "vendor" ? "pending" : "approved",
  ];

  const [result] = await db.query(sql, values);
  return result.insertId;
};

module.exports = {
  findUserByEmail,
  createUser,
};
