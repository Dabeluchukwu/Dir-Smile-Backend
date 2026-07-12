const { loginAdmin } = require('./admin.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide email and password'));
  }
  
  const admin = await loginAdmin(email, password);
  
  res.status(200).json(new ApiResponse(200, admin, 'Login successful'));
});

module.exports = {
  login,
};