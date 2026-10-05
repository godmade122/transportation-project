const User = require("../models/User");
const Booking = require("../models/Booking");
const Price = require("../models/Price");


// GET ADMIN DASHBOARD
const getDashboardStats = async (req, res) => {
  try {
    // Count users
    const totalUsers = await User.countDocuments();

    // Count bookings
    const totalBookings = await Booking.countDocuments();

    // Count bookings by status
    const pendingBookings = await Booking.countDocuments({
      status: "pending"
    });

    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed"
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled"
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed"
    });

    // Count prices
    const totalPrices = await Price.countDocuments();

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: {
            $in: ["confirmed", "completed"]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price"
          }
        }
      }
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalBookings,
        totalPrices,

        bookings: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          completed: completedBookings
        },

        totalRevenue,

        recentBookings
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};