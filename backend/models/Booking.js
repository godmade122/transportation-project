const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rideType: {
      type: String,
      required: true,
      enum: [
        "Standard Ride",
        "Premium Ride",
        "Airport Shuttle"
      ],
    },

    pickupLocation: {
      type: String,
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    travelDate: {
      type: Date,
      required: true
    },

    travelTime: {
      type: String,
      required: true
    },

    passengers: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed"
      ],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed"
      ],
      default: "pending"
    },
    
      paymentReference: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);