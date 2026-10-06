let prices = [];

// GET PRICES FROM BACKEND
async function loadPrices() {
  try {
    const response = await fetch(
      `${API_URL}/api/prices`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load prices"
      );
    }

    prices = data.prices || data;

    console.log("Prices loaded:", prices);

  } catch (error) {
    console.error("Error loading prices:", error);
  }
}


// BOOKING FORM
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", async (event) => {

  // VERY IMPORTANT: stop the page from reloading
  event.preventDefault();

  console.log("Booking form submitted");

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login before booking a ride.");
    window.location.href = "login.html";
    return;
  }

  const rideType =
    document.getElementById("rideType").value;

  const pickupLocation =
    document.getElementById("pickupLocation").value.trim();

  const destination =
    document.getElementById("destination").value.trim();

  const travelDate =
    document.getElementById("travelDate").value;

  const travelTime =
    document.getElementById("travelTime").value;

  const passengers =
    Number(document.getElementById("passengers").value);

  if (
    !rideType ||
    !pickupLocation ||
    !destination ||
    !travelDate ||
    !travelTime ||
    !passengers
  ) {
    alert("Please fill in all booking details.");
    return;
  }

  try {

    console.log("Creating booking...");

    const response = await fetch(
      `${API_URL}/api/bookings`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
          rideType,
          pickupLocation,
          destination,
          travelDate,
          travelTime,
          passengers
        })
      }
    );

    const data = await response.json();

    console.log("Booking response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create booking."
      );
    }

    // Hide booking form
    bookingForm.style.display = "none";

    // Show success section
    const bookingResult =
      document.getElementById("bookingResult");

    bookingResult.style.display = "block";

    // Display price
    const bookingPrice =
      document.getElementById("bookingPrice");

    const totalAmount =
      data.totalAmount ||
      data.booking?.totalAmount ||
      data.price ||
      data.booking?.price ||
      0;

    bookingPrice.textContent =
      `₦${Number(totalAmount).toLocaleString()}`;

    // Save booking ID for payment
    if (data.booking?._id) {
      localStorage.setItem(
        "lastBookingId",
        data.booking._id
      );
    } else if (data.bookingId) {
      localStorage.setItem(
        "lastBookingId",
        data.bookingId
      );
    }

    alert("Booking created successfully!");

  } catch (error) {

    console.error(
      "Booking error:",
      error
    );

    alert(
      error.message ||
      "Something went wrong while creating your booking."
    );
  }
});


// PROCEED TO PAYMENT
const proceedPayment =
  document.getElementById("proceedPayment");

if (proceedPayment) {

  proceedPayment.addEventListener(
    "click",
    () => {

      const bookingId =
        localStorage.getItem("lastBookingId");

      if (!bookingId) {
        alert("Booking ID not found.");
        return;
      }

      window.location.href =
        `my-bookings.html?bookingId=${encodeURIComponent(bookingId)}`;
    }
  );
}


// LOAD PRICES WHEN PAGE OPENS
loadPrices();