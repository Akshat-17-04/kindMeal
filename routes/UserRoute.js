const express = require("express");
const users = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.route("/register").post(async (req, res) => {
  try {
    //console.log("Headers:", req.headers);
    //console.log("Body received:", req.body);
    const { email, name, password, phone, organization, role } = req.body;
    await users.create({ email, name, password, phone, organization, role });
    return res.status(200).json({ message: "User registered" });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});
router.route("/login").post(async (req, res) => {
  try {
    const user = await users.findOne({ email: req.body.email });
    console.log(user);
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    //Creating JWT token for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.cookie("token", token).status(200).json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: err.message });
  }
});
module.exports = router;
