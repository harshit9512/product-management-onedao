var bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateToken } = require("../utils/jwtUtils");
const { generateOTP } = require("../controller/otpHelper");
const { checkCountryRestriction } = require("../utils/countryUtils"); // Import the utility function
const argon2 = require("argon2");
const geoip = require("geoip-lite");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    console.log(user.dataValues.password);

    const isPasswordValid = await bcrypt.compare(
      password,
      user.dataValues.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.json({ success: true, message: "Sign in successfully", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Handle localhost case
    if (ip === "127.0.0.1" || ip === "::1") {
      return registerUser(name, email, password, res);
    }

    const geoData = geoip.lookup(ip);
    if (!geoData) {
      return res
        .status(400)
        .json({ message: "Unable to detect country based on IP address." });
    }
    const country = geoData.country;

    const countryStatus = checkCountryRestriction(country);
    if (!countryStatus.allowed) {
      return res.status(403).json({ message: countryStatus.message });
    } else {
      return registerUser(name, email, password, res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function registerUser(name, email, password, res) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  const otp = await generateOTP({ body: { email } }, res);

  // password hashed before storing
  // const hashPassword = async (password) => {
  //   return await argon2.hash(password);
  // };

  // const hashedPassword = await hashPassword(password);

  const newUser = await User.create({ name, email, password });

  const token = generateToken({ id: newUser.id, email: newUser.email });

  return res.status(201).json({
    message: "User created successfully.",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    otp,
    token,
  });
}
