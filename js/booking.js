const bookingForm = document.getElementById("bookingForm");

const rideTypeSelect = document.getElementById("rideType");

const priceIdInput = document.getElementById("priceId");

let prices = [];


// GET PRICES FROM BACKEND

async function loadPrices() {

  try {

    const response = await fetch(
      `${API_URL}/prices`
    );

    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.message || "Failed to load prices"
      );

    }


    prices = data.prices || data;

    console.log(
      "Prices loaded:",
      prices
    );


  } catch (error) {

    console.error(
      "Error loading prices:",
      error
    );

  }

}


// Load prices when page opens

loadPrices();


// GET PRICE ID WHEN RIDE CHANGES

rideTypeSelect.addEventListener(
  "change",
  () => {

    const selectedRide =
      rideTypeSelect.value;


    const selectedPrice =
      prices.find(
        (price) =>
          price.rideType === selectedRide
      );


    if (selectedPrice) {

      priceIdInput.value =
        selectedPrice._id;


      console.log(
        "Selected Price ID:",
        selectedPrice._id
      );

    } else {

      priceIdInput.value = "";

      console.log(
        "No price found for:",
        selectedRide
      );

    }

  }
);

// CREATE BOOKING

bookingForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();


    const token =
      localStorage.getItem("token");


    // Check login

    if (!token) {

      alert(
        "Please login before making a booking."
      );

      window.location.href =
        "login.html";

      return;

    }


    // Get booking data

    const bookingData = {

      rideType:
        document.getElementById(
          "rideType"
        ).value,


      pickupLocation:
        document.getElementById(
          "pickupLocation"
        ).value,


      destination:
        document.getElementById(
          "destination"
        ).value,


      travelDate:
        document.getElementById(
          "travelDate"
        ).value,


      travelTime:
        document.getElementById(
          "travelTime"
        ).value,


      passengers:
        Number(
          document.getElementById(
            "passengers"
          ).value
        ),


      priceId:
        priceIdInput.value

    };


    console.log(
      "Booking data being sent:",
      bookingData
    );


    // Check price

    if (!bookingData.priceId) {

      alert(
        "Price not found for this ride type. Please contact the administrator."
      );

      return;

    }


    try {

      const response = await fetch(

        `${API_URL}/bookings`,

        {

          method: "POST",


          headers: {

            "Content-Type":
              "application/json",


            "Authorization":
              `Bearer ${token}`

          },


          body:
            JSON.stringify(
              bookingData
            )

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.message ||
          "Failed to create booking"

        );

      }


      console.log(
        "Booking created:",
        data
      );


      alert(
        "Booking created successfully!"
      );


      bookingForm.reset();

      priceIdInput.value = "";


      // Go to My Bookings

      window.location.href =
        "my-bookings.html";


    } catch (error) {

      console.error(
        "Booking error:",
        error
      );


      alert(
        error.message
      );

    }

  }
);