let prices = [];


// ===============================
// GET PRICES FROM BACKEND
// ===============================
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

    console.error(
      "Error loading prices:",
      error
    );

  }
}


// ===============================
// BOOKING FORM
// ===============================
const bookingForm =
  document.getElementById("bookingForm");

bookingForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    console.log("Booking form submitted");


    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Please login before booking a ride."
      );

      window.location.href =
        "login.html";

      return;
    }


    const rideType =
      document.getElementById(
        "rideType"
      ).value;

    const pickupLocation =
      document.getElementById(
        "pickupLocation"
      ).value.trim();

    const destination =
      document.getElementById(
        "destination"
      ).value.trim();

    const travelDate =
      document.getElementById(
        "travelDate"
      ).value;

    const travelTime =
      document.getElementById(
        "travelTime"
      ).value;

    const passengers =
      Number(
        document.getElementById(
          "passengers"
        ).value
      );


    // ===============================
    // FIND PRICE FOR SELECTED RIDE
    // ===============================

    const selectedPrice =
      prices.find(
        (price) =>
          price.name === rideType ||
          price.rideType === rideType
      );


    if (!selectedPrice) {

      alert(
        "Price for this ride type was not found."
      );

      console.error(
        "Available prices:",
        prices
      );

      return;
    }


    const priceId =
      selectedPrice._id;


    // Put price ID inside hidden input
    document.getElementById(
      "priceId"
    ).value = priceId;


    console.log(
      "Selected price:",
      selectedPrice
    );

    console.log(
      "Price ID:",
      priceId
    );


    if (
      !rideType ||
      !pickupLocation ||
      !destination ||
      !travelDate ||
      !travelTime ||
      !passengers
    ) {

      alert(
        "Please fill in all booking details."
      );

      return;
    }


    try {

      console.log(
        "Creating booking..."
      );


      const response =
        await fetch(
          `${API_URL}/api/bookings`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${token}`
            },

            body: JSON.stringify({

              rideType,

              pickupLocation,

              destination,

              travelDate,

              travelTime,

              passengers,

              priceId

            })
          }
        );


      const data =
        await response.json();


      console.log(
        "Booking response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to create booking."
        );

      }


      // ===============================
      // HIDE FORM
      // ===============================

      bookingForm.style.display =
        "none";


      // ===============================
      // SHOW SUCCESS
      // ===============================

      const bookingResult =
        document.getElementById(
          "bookingResult"
        );

      bookingResult.style.display =
        "block";


      // ===============================
      // DISPLAY PRICE
      // ===============================

      const bookingPrice =
        document.getElementById(
          "bookingPrice"
        );


      const totalAmount =
        data.totalAmount ||
        data.booking?.totalAmount ||
        data.price ||
        data.booking?.price ||
        selectedPrice.amount ||
        0;


      bookingPrice.textContent =
        `₦${Number(
          totalAmount
        ).toLocaleString()}`;


      // ===============================
      // SAVE BOOKING ID
      // ===============================

      if (
        data.booking &&
        data.booking._id
      ) {

        localStorage.setItem(
          "lastBookingId",
          data.booking._id
        );

      } else if (
        data.bookingId
      ) {

        localStorage.setItem(
          "lastBookingId",
          data.bookingId
        );

      }


      alert(
        "Booking created successfully!"
      );


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

  }
);


// ===============================
// PROCEED TO PAYMENT
// ===============================

const proceedPayment =
  document.getElementById(
    "proceedPayment"
  );


if (proceedPayment) {

  proceedPayment.addEventListener(
    "click",
    () => {

      const bookingId =
        localStorage.getItem(
          "lastBookingId"
        );


      if (!bookingId) {

        alert(
          "Booking ID not found."
        );

        return;
      }


      window.location.href =
        `my-bookings.html?bookingId=${encodeURIComponent(
          bookingId
        )}`;

    }
  );

}


// ===============================
// LOAD PRICES
// ===============================

loadPrices();