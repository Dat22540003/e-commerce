const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");

// Register user
// const register = asyncHandler(async (req, res) => {
//   const { firstname, lastname, email, password } = req.body;
//   if (!email || !password || !firstname || !lastname) {
//     return res.status(400).json({
//       success: false,
//       message: 'Missing input',
//     });
//   }

//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Error('User already exists');
//   } else {
//     const newUser = await User.create(req.body);
//     return res.status(200).json({
//       success: newUser ? true : false,
//       message: newUser
//         ? 'Registration successful. Please go to login!'
//         : 'Registration failed!',
//     });
//   }
// });

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  } else {
    const token = makeToken();
    res.cookie(
      "registerData",
      { ...req.body, token },
      { httpOnly: true, maxAge: 1000 * 60 * 15 }
    );

    const html = `Please click this link to complete your registration. This link will expire after 15 minutes. 
  <a href=${process.env.URL_SERVER}/api/user/completeregister/${token}>Click here</a>`;

    await sendMail({ email, html, subject: "Completing register process!" });

    res.status(200).json({
      success: true,
      message: "Please check your email to complete registration!",
    });
  }
});

const completeRegister = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const { token } = req.params;
  if (!cookie || cookie?.registerData?.token !== token) {
    return res.redirect(`${process.env.CLIENT_URL}/completeregister/failed`);
  }

  const newUser = await User.create({
    email: cookie?.registerData?.email,
    password: cookie?.registerData?.password,
    firstname: cookie?.registerData?.firstname,
    lastname: cookie?.registerData?.lastname,
    mobile: cookie?.registerData?.mobile,
  });

  if (newUser) {
    return res.redirect(`${process.env.CLIENT_URL}/completeregister/succeed`);
  } else {
    return res.redirect(`${process.env.CLIENT_URL}/completeregister/failed`);
  }
});

// Refresh token is used to generate new access token
// Access token is used to authenticate user and assign role
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // Remove password from response
    const { role, password, refreshToken, ...userData } = response.toObject();

    // Generate tokens
    const accessToken = generateAccessToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);

    // Save refresh token in database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );

    // Save refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

// Get current user
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id }).select(
    "-refreshToken -password -role"
  );
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});

// Refresh token is used to generate new access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookie
  const cookie = req.cookies;

  // Check if refresh token exists
  if (!cookie && !cookie.refreshToken) {
    throw new Error("No refresh token in cookie");
  }

  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "refresh token expired! Please login again!",
  });
});

// Logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) {
    throw new Error("No refresh token in cookie");
  }

  // Delete refresh token from database
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );

  // Delete refresh token from cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// forgot password - send reset token to user's email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) {
    throw new Error("Please provide email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  // Send reset token to user's email
  const html = `Please click this link to reset your password. This link will expire after 15 minutes. 
  <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
    subject: "Forgot password",
  };

  const rs = await sendMail(data);

  return res.status(200).json({
    success: true,
    rs,
  });
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password, resetToken } = req.body;
  if (!password || !resetToken) {
    throw new Error("Please provide password and reset token");
  }
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token is invalid or expired");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Password reset successful" : "Password reset failed",
  });
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: users ? true : false,
    users,
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("User not found");

  const users = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: users ? true : false,
    deletedUser: users
      ? `User with email ${users.email} has been deleted`
      : `User not found!`,
  });
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");

  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    updatedUser: user ? user : `User not found!`,
  });
});

// Update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");

  const user = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    updatedUser: user ? user : `User not found!`,
  });
});

// Update user address
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const user = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    updatedUser: user ? user : `User not found!`,
  });
});

// Update user cart
const updateUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyAdded = user?.cart?.find((el) => el.product.toString() === pid);
  if (alreadyAdded) {
    if (alreadyAdded.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyAdded } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUserCart: response ? response : `User not found!`,
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUserCart: response ? response : `User not found!`,
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUserCart: response ? response : `User not found!`,
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateUserCart,
  completeRegister,
};
