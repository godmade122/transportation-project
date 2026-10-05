const express = require("express");

const {
  getPrices,
  createPrice,
  updatePrice,
  deletePrice
} = require("../controllers/priceController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();


// GET ALL PRICES
// Everyone can view prices

router.get(
  "/",
  getPrices
);


// CREATE PRICE
// Admin only

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createPrice
);


// UPDATE PRICE
// Admin only

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updatePrice
);


// DELETE PRICE
// Admin only

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deletePrice
);


module.exports = router;