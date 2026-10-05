require("dotenv").config();

const express = require("express");
const cors = require('cors');
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes")

const priceRoutes = require("./routes/priceRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
connectDB();

const frontedOrigin = new URL(process.env.FRONTEND_URL).origin;

app.use(cors({
     origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501"
  ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes must come AFTER express.json()
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/prices", priceRoutes)
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});