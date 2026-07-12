const Admin = require('./admin.model');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  
  if (!admin) {
    throw new ApiError(401, 'Invalid credentials');
  }
  
  const isMatch = await admin.matchPassword(password);
  
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }
  
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  return {
    _id: admin._id,
    email: admin.email,
    name: admin.name,
    token,
  };
};

const createInitialAdmin = async () => {
  const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  
  if (!adminExists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: 'DIR. SMILIE Admin',
    });
    console.log('Admin user created');
  }
};

module.exports = {
  loginAdmin,
  createInitialAdmin,
};