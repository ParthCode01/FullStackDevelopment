// User Model - Database operations for users table
// Note: Authentication is handled by Spring Boot
// This model is mainly for retrieving user information in Node.js

const { pool } = require('../config/db');

// Get user by ID
const getUserById = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );
    return users[0];
  } finally {
    connection.release();
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  } finally {
    connection.release();
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
};
