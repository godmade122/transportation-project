const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    rideType: {
      type: String,
      required: true,
      // enum: [
      //   "Standard Ride",
      //   "Premium Ride",
      //   "Airport Shuttle"
      // ],
      trim: true,
      unique: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Price", priceSchema);