// src/utils/jwtUtls.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '1h'; // Token จะหมดอายุใน 1 ชั่วโมง

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      employee_id: user.employee_id, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };