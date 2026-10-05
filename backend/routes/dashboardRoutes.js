const express = require("express");
const router = express.Router();

const {
    getDashboardStats
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin Dashboard

router.get("/", authMiddleware,adminMiddleware,getDashboardStats);

module.exports = router;