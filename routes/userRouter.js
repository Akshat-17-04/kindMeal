const express = require("express");
//const users = require("../models/User");
const { Donation } = require("../models/Donation");
const createAuditLog = require("../helper/auditLog");
//const jwt = require("jsonwebtoken");
const router = express.Router();
const { authRoles, checkForLogin } = require("../middlewares/auth");
//Donation creation
router
  .route("/kind-meal/donate", checkForLogin, authRoles("DONOR"))
  .post(async (req, res) => {
    try {
      const donation = await Donation.create({
        donor: req.user._id,
        category: req.body.category,
        quantity: req.body.quantity,
        unit: req.body.unit,
        expiryAt: req.body.expiryAt,
        location: {
          type: "Point",
          coordinates: req.body.location.coordinates,
        },
      });
      return res.status(101).json({ message: `donation created`, donation });
    } catch (err) {
      console.log(`cannot create donation...error occured${err}`);
      res
        .status(500)
        .json({ error: "Failed to create donation", details: err.message });
    }
  });
//Donation receiving
router
  .route("/kind-meal/receive/:id", checkForLogin, authRoles("RECEIVER"))
  .post(async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation || donation.status !== "LISTED") {
        return res.status(400).json({ error: "Donation not available" });
      }

      donation.status = "MATCHED";
      donation.receiver = req.user._id;
      donation.deliveryLocation = {
        type: "Point",
        coordinates: req.body.deliveryLocation.coordinates,
      };
      await donation.save();
      //Details
      await createAuditLog({
        actorId: req.user._id,
        action: "MATCHED",
        entity: "Donation",
        entityId: donation._id,
        data: { status: "MATCHED", receiver: req.user._id },
      });
      res
        .status(200)
        .json({ message: "Donation matched to receiver", donation });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to claim donation", details: err.message });
    }
  });
//Driver router
router
  .route("/kind-meal/:id/driver", checkForLogin, authRoles("DRIVER"))
  .post(async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation || donation.status !== "MATCHED") {
        return res.status(400).json({ error: "Donation not ready for pickup" });
      }

      donation.status = "PICKED";
      donation.driver = req.user._id;
      await donation.save();

      res
        .status(200)
        .json({ message: "Donation picked up by driver", donation });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to assign driver", details: err.message });
    }
  });
//Admin router
router
  .route("/kind-meal/admin", checkForLogin, authRoles("ADMIN"))
  .post(async (req, res) => {
    try {
      const donations = await Donation.find()
        .populate("donor receiver driver", "name email role")
        .select("-__v");

      res.status(200).json({ donations });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch all donations", details: err.message });
    }
  });
//Cancelling a donation
router.post(
  "/kind-meal/admin/reset/:id",
  checkForLogin,
  authRoles("ADMIN"),
  async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: "Donation not found" });
      }
      if (donation.status === "DELIVERED") {
        return res
          .status(400)
          .json({ error: "Cannot reset a delivered donation" });
      }
      donation.status = "LISTED";
      donation.receiver = null;
      donation.driver = null;
      await donation.save();
      //Details
      await createAuditLog({
        actorId: req.user._id,
        action: "RESET",
        entity: "Donation",
        entityId: donation._id,
        data: { status: "LISTED" },
      });
      res
        .status(200)
        .json({ message: "Donation reset to available", donation });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to reset donation", details: err.message });
    }
  }
);
//Admin views all details of perticular donation
router.get(
  "/kind-meal/admin/logs/:id",
  checkForLogin,
  authRoles("ADMIN"),
  async (req, res) => {
    try {
      const logs = await AuditLog.find({
        entity: "Donation",
        entityId: req.params.id,
      })
        .populate("actorId", "name email role")
        .sort({ createdAt: 1 });

      res.status(200).json({ logs });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch logs", details: err.message });
    }
  }
);
//All donations info
router.get(
  "/kind-meal/admin/logs",
  checkForLogin,
  authRoles("ADMIN"),
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("actorId", "name email role")
        .sort({ createdAt: -1 });

      res.status(200).json({ logs });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch audit logs", details: err.message });
    }
  }
);
//Listing available donations
router.route("/kind-meal/list", checkForLogin).post(async (req, res) => {
  try {
    const donations = await Donation.find({ status: "LISTED" })
      .populate("donor", "name email")
      .select("-__v");
    return res.status(200).json({ donations });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ message: `cannot fetch donations`, details: err.message });
  }
});
//Pickup
router.post(
  "/kind-meal/:id/driver",
  checkForLogin,
  authRoles("DRIVER"),
  async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation || donation.status !== "MATCHED") {
        return res.status(400).json({ error: "Donation not ready for pickup" });
      }

      donation.status = "PICKED";
      await donation.save();

      res
        .status(200)
        .json({ message: "Donation picked up by driver", donation });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to assign driver", details: err.message });
    }
  }
);
//Donation delivered
router.post(
  "/kind-meal/:id/deliver",
  checkForLogin,
  authRoles("DRIVER"),
  async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation || donation.status !== "PICKED") {
        return res
          .status(400)
          .json({ error: "Donation not ready for delivery" });
      }

      donation.status = "DELIVERED";
      donation.deliveredAt = new Date();
      await donation.save();

      res
        .status(200)
        .json({ message: "Donation delivered successfully", donation });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to deliver donation", details: err.message });
    }
  }
);
module.exports = router;
