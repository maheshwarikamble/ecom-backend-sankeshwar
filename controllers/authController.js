const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, email, and password",
      });
    }

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const newUser = await User.create({
      email,
      password,
    });
    res.status(201).json({
      message: "User registered successfullly",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Something went wrong while registering the user",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "Something went wrong while logging in the user",
    });
  }
};

const logoutUser = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
