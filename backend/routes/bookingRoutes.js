const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, createBooking);

router.get("/my-bookings", authMiddleware, getMyBookings);

// GET ALL BOOKINGS - ADMIN
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);

module.exports = router;