const express = require("express");
const users = require("../models/User");
//const jwt = require("jsonwebtoken");
const router = express.Router();
router.route("/register").post(async (req, res) => {
  try {
    //console.log("Headers:", req.headers);
    //console.log("Body received:", req.body);
    const { email, name, password, phone, organization, role } = req.body;
    const user = await users.create({
      email,
      name,
      password,
      phone,
      organization,
      role,
    });
    //express-session for authentication
    req.session.userId = user._id;
    req.session.role = user.role;

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
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //express-session for authentication
    req.session.userId = user._id;
    req.session.role = user_role;
    //Creating JWT token for authentication
    /*const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });*/
    //return res.cookie("token", token).status(200).json({ token });
    return res.status(200).json({
      message: "login successful",
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out, try again" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "logged out" });
  });
});
module.exports = router;
