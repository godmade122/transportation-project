const Booking = require("../models/Booking");
const Price = require("../models/Price");

// CREATE BOOKING
const createBooking = async (req, res) => {

  try {

    console.log("Booking request body:", req.body);


    const {
      rideType,
      pickupLocation,
      destination,
      travelDate,
      travelTime,
      passengers,
      priceId
    } = req.body || {};


    // Validate ride type

    if (!rideType) {

      return res.status(400).json({
        success: false,
        message: "Ride type is required."
      });

    }


    // Validate pickup location

    if (!pickupLocation) {

      return res.status(400).json({
        success: false,
        message: "Pickup location is required."
      });

    }


    // Validate destination

    if (!destination) {

      return res.status(400).json({
        success: false,
        message: "Destination is required."
      });

    }


    // Validate travel date

    if (!travelDate) {

      return res.status(400).json({
        success: false,
        message: "Travel date is required."
      });

    }


    // Validate travel time

    if (!travelTime) {

      return res.status(400).json({
        success: false,
        message: "Travel time is required."
      });

    }


    // Validate passengers

    if (!passengers || Number(passengers) < 1) {

      return res.status(400).json({
        success: false,
        message: "At least one passenger is required."
      });

    }


    // Validate price ID

    if (!priceId) {

      return res.status(400).json({
        success: false,
        message: "Price ID is required."
      });

    }


    // Find price

    const priceData =
      await Price.findById(priceId);


    if (!priceData) {

      return res.status(404).json({
        success: false,
        message: "Price not found."
      });

    }


    // Create booking

    const booking =
      await Booking.create({

        user: req.user.id,

        rideType,

        pickupLocation,

        destination,

        travelDate,

        travelTime,

        passengers: Number(passengers),

        // Save amount from database
        price: priceData.amount

      });


    return res.status(201).json({

      success: true,

      message:
        "Booking created successfully.",

      booking

    });


  } catch (error) {

    console.error(
      "Create booking error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to create booking.",

      error:
        error.message

    });

  }

};


// GET MY BOOKINGS

const getMyBookings = async (req, res) => {

  try {

    const bookings =
      await Booking.find({

        user: req.user.id

      }).sort({

        createdAt: -1

      });


    return res.status(200).json({

      success: true,

      count: bookings.length,

      bookings

    });


  } catch (error) {

    console.error(
      "Get my bookings error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to get your bookings.",

      error:
        error.message

    });

  }

};


// GET SINGLE BOOKING

const getBookingById =
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        )
          .populate(
            "user",
            "name email"
          );


      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found."

        });

      }


      // Check authorization

      if (

        booking.user._id
          .toString() !==
          req.user.id

        &&

        req.user.role !==
          "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "You are not authorized to view this booking."

        });

      }


      return res.status(200).json({

        success: true,

        booking

      });


    } catch (error) {

      console.error(
        "Get booking error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to get booking.",

        error:
          error.message

      });

    }

  };


// GET ALL BOOKINGS - ADMIN

const getAllBookings =
  async (req, res) => {

    try {

      const bookings =
        await Booking.find()

          .populate(
            "user",
            "name email"
          )

          .sort({

            createdAt: -1

          });


      return res.status(200).json({

        success: true,

        count:
          bookings.length,

        bookings

      });


    } catch (error) {

      console.error(
        "Get all bookings error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to get bookings.",

        error:
          error.message

      });

    }

  };


// UPDATE BOOKING STATUS - ADMIN

const updateBookingStatus =
  async (req, res) => {

    try {

      const { status } =
        req.body || {};


      const allowedStatuses = [

        "pending",

        "confirmed",

        "cancelled",

        "completed"

      ];


      if (!status) {

        return res.status(400).json({

          success: false,

          message:
            "Booking status is required."

        });

      }


      if (
        !allowedStatuses.includes(status)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid booking status."

        });

      }


      const booking =
        await Booking.findById(
          req.params.id
        );


      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found."

        });

      }


      booking.status =
        status;


      await booking.save();


      return res.status(200).json({

        success: true,

        message:
          "Booking status updated successfully.",

        booking

      });


    } catch (error) {

      console.error(
        "Update booking status error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update booking status.",

        error:
          error.message

      });

    }

  };

// CANCEL BOOKING

const cancelBooking =
  async (req, res) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );


      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found."

        });

      }


      // Only owner or admin

      if (

        booking.user.toString() !==
          req.user.id

        &&

        req.user.role !==
          "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "You are not authorized to cancel this booking."

        });

      }


      booking.status =
        "cancelled";


      await booking.save();


      return res.status(200).json({

        success: true,

        message:
          "Booking cancelled successfully.",

        booking

      });


    } catch (error) {

      console.error(
        "Cancel booking error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to cancel booking.",

        error:
          error.message

      });

    }

  };

// EXPORT CONTROLLERS

module.exports = {

  createBooking,

  getMyBookings,

  getBookingById,

  getAllBookings,

  updateBookingStatus,

  cancelBooking

};