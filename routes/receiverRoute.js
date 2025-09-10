const express = require("express");
const users = require("../models/User");
//const jwt = require("jsonwebtoken");
const router = express.Router();
const { authRoles, checkForLogin } = require("../middlewares/auth");
router
  .route("/kind-meal/donate", checkForLogin, authRoles("DONOR"))
  .post((req, res) => {
    return res.status(101).json({ message: `donation created` });
  });
router
  .route("/kind-meal/receive", checkForLogin, authRoles("RECEIVER"))
  .post((req, res) => {
    return res.status(101).json({ message: `donation received` });
  });
router
  .route("/kind-meal/:id/driver", checkForLogin, authRoles("DRIVER"))
  .post((req, res) => {
    return res.status(101).json({ message: `driver assigned` });
  });
router
  .route("/kind-meal/admin", checkForLogin, authRoles("ADMIN"))
  .post((req, res) => {
    return res.status(101).json({ message: `welcome login` });
  });
module.exports = router;
