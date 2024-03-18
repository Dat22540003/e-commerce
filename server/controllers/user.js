const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      Message: newUser
        ? "Registration successful. Please go to login!"
        : "Registration failed!",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  const response = await User.findOne({ email });
  if (response && await response.isCorrectPassword(password)) {
    const {role, password, ...userData} = response.toObject();
    return res.status(200).json({
      success: true,
      userData
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

module.exports = {
  register,
  login,
};
