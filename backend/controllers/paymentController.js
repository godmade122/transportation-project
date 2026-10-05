const axios = require("axios");
const Booking = require("../models/Booking");


// INITIALIZE PAYMENT

exports.initializePayment = async (req, res) => {

  try {

    const booking = await Booking
      .findById(req.params.bookingId)
      .populate("user");


    if (!booking) {

      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });

    }


    // Check authorization

    if (
      req.user.role !== "admin" &&
      booking.user._id.toString() !== req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized."
      });

    }


    // CALCULATE TOTAL AMOUNT

    const totalAmount =
      Number(booking.price) *
      Number(booking.passengers);


    // SHOW CALLBACK URL IN TERMINAL

    console.log(
      "Paystack callback URL:",
      `${process.env.FRONTEND_URL}/payment-success.html`
    );


    // INITIALIZE PAYSTACK PAYMENT

    const response = await axios.post(

      "https://api.paystack.co/transaction/initialize",

      {

        email: booking.user.email,

        // Paystack uses kobo

        amount: totalAmount * 100,


        callback_url:
          `${process.env.FRONTEND_URL}/payment-success.html`

      },

      {

        headers: {

          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type":
            "application/json"

        }

      }

    );


    // Save Paystack reference

    booking.paymentReference =
      response.data.data.reference;

    await booking.save();


    return res.status(200).json({

      success: true,

      authorization_url:
        response.data.data.authorization_url

    });


  } catch (error) {

    console.error(
      "Payment initialization error:",
      error.response?.data || error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.response?.data?.message ||
        "Failed to initialize payment."

    });

  }

};



// VERIFY PAYMENT

exports.verifyPayment = async (req, res) => {

  try {

    const reference =
      req.query.reference;


    if (!reference) {

      return res.status(400).json({

        success: false,

        message:
          "Payment reference is required."

      });

    }


    // Verify transaction with Paystack

    const response = await axios.get(

      `https://api.paystack.co/transaction/verify/${reference}`,

      {

        headers: {

          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`

        }

      }

    );


    // Check payment status

    if (
      response.data.data.status !== "success"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Payment failed."

      });

    }


    // Find booking

    const booking =
      await Booking.findOne({

        paymentReference:
          reference

      });


    if (!booking) {

      return res.status(404).json({

        success: false,

        message:
          "Booking not found."

      });

    }


    // UPDATE PAYMENT STATUS

    booking.paymentStatus = "paid";


    // UPDATE BOOKING STATUS

    booking.status = "confirmed";


    await booking.save();


    return res.status(200).json({

      success: true,

      message:
        "Payment verified successfully.",

      bookingId:
        booking._id

    });


  } catch (error) {

    console.error(
      "Payment verification error:",
      error.response?.data || error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.response?.data?.message ||
        "Failed to verify payment."

    });

  }

};