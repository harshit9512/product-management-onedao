
exports.login = async (req, res) => {
s.status(500).json({ error: err.message });

};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ip === "127.0.0.1" || ip === "::1") {
      return registerUser(name, email, password, res);
    }
    const geoData = geoip.lookup(ip);
    if (!geoData) {
      return res
        .status(500)
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
    return res.status(400).json({ message: "User is already registered." });
  }
  const otp = await generateOTP({ body: { email } }, res);
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



