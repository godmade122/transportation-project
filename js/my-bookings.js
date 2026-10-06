const bookingsContainer =
  document.getElementById("bookingsContainer");


// CHECK LOGIN

const token = localStorage.getItem("token");

if (!token) {

  alert("Please login to view your bookings.");

  window.location.href = "login.html";

}


// LOAD MY BOOKINGS

async function loadMyBookings() {

  try {

    const response = await fetch(
      `${API_URL}/api/bookings/my-bookings`,
      {
        method: "GET",

        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.message || "Failed to load bookings."
      );

    }


    const bookings = data.bookings;


    // EMPTY BOOKINGS

    if (!bookings || bookings.length === 0) {

      bookingsContainer.innerHTML = `

        <div class="empty-bookings">

          <h2>No Bookings Yet</h2>

          <p>
            You have not created any bookings yet.
          </p>

          <a
            href="booking.html"
            class="book-ride-btn"
          >
            Book a Ride
          </a>

        </div>

      `;

      return;

    }


    // Clear container

    bookingsContainer.innerHTML = "";


    // DISPLAY BOOKINGS

    bookings.forEach((booking) => {

      const bookingCard =
        document.createElement("div");


      bookingCard.classList.add(
        "booking-card"
      );


      // FORMAT DATE

      let formattedDate =
        "Not available";


      if (booking.travelDate) {

        formattedDate =
          new Date(
            booking.travelDate
          ).toLocaleDateString(
            "en-NG",
            {
              year: "numeric",
              month: "long",
              day: "numeric"
            }
          );

      }


      // FORMAT PRICE

      const formattedPrice =
        Number(
          booking.price || 0
        ).toLocaleString("en-NG");


      // DISPLAY BOOKING

      bookingCard.innerHTML = `

        <div class="booking-header">

          <h3>
            ${booking.rideType}
          </h3>

          <span class="booking-status">

            ${booking.status}

          </span>

        </div>


        <div class="booking-details">

          <p>

            <strong>From:</strong>

            ${booking.pickupLocation}

          </p>


          <p>

            <strong>To:</strong>

            ${booking.destination}

          </p>


          <p>

            <strong>Date:</strong>

            ${formattedDate}

          </p>


          <p>

            <strong>Time:</strong>

            ${booking.travelTime || "Not available"}

          </p>


          <p>

            <strong>Passengers:</strong>

            ${booking.passengers}

          </p>


          <p>

            <strong>Price Per Passenger:</strong>

            ₦${formattedPrice}

          </p>


          <p>

            <strong>Payment:</strong>

            ${booking.paymentStatus}

          </p>


          ${
            booking.paymentStatus === "pending"

              ? `

                <button
                  class="pay-now-btn"
                  onclick="payNow('${booking._id}')"
                >

                  Pay Now

                </button>

              `

              : `

                <span class="paid-text">

                  Payment Completed

                </span>

              `

          }


        </div>

      `;


      bookingsContainer.appendChild(
        bookingCard
      );

    });


  } catch (error) {

    console.error(
      "Load bookings error:",
      error
    );


    bookingsContainer.innerHTML = `

      <div class="empty-bookings">

        <h2>
          Unable to Load Bookings
        </h2>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

}


// ==============================
// PAY NOW - PAYSTACK
// ==============================

async function payNow(bookingId) {

  const token =
    localStorage.getItem("token");


  if (!token) {

    alert("Please login first.");

    window.location.href =
      "login.html";

    return;

  }


  try {

    console.log(
      "Initializing payment for:",
      bookingId
    );


    const response = await fetch(

      `${API_URL}/api/payment/initialize/${bookingId}`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${token}`

        }

      }

    );


    // Check response type first

    const contentType =
      response.headers.get("content-type");


    if (
      !contentType ||
      !contentType.includes("application/json")
    ) {

      const text =
        await response.text();


      console.error(
        "Server returned non-JSON:",
        text
      );


      throw new Error(
        "Server returned an invalid response. Check your payment route."
      );

    }


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(

        data.message ||
        "Failed to initialize payment."

      );

    }


    console.log(
      "Payment response:",
      data
    );


    // ==============================
    // REDIRECT TO PAYSTACK
    // ==============================

    if (!data.authorization_url) {

      throw new Error(
        "Paystack authorization URL was not received."
      );

    }


    window.location.href =
      data.authorization_url;


  } catch (error) {

    console.error(
      "Payment error:",
      error
    );


    alert(
      error.message
    );

  }

}


// ==============================
// LOAD BOOKINGS
// ==============================

loadMyBookings();