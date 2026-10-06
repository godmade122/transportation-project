const paymentSuccessContainer = document.getElementById(
  "paymentSuccessContainer"
);


// GET PAYSTACK REFERENCE FROM URL

const params = new URLSearchParams(
  window.location.search
);

const reference = params.get("reference");


console.log(
  "Payment reference:",
  reference
);


// IF NO REFERENCE

if (!reference) {

  paymentSuccessContainer.innerHTML = `

    <div class="empty-message">

      <h2>No Payment Information</h2>

      <p>
        Payment information is not available.
      </p>

      <a
        href="my-bookings.html"
        class="view-bookings-btn"
      >
        View My Bookings
      </a>

    </div>

  `;

} else {

  verifyPayment();

}


// VERIFY PAYMENT

async function verifyPayment() {

  const token =
    localStorage.getItem("token");


  if (!token) {

    paymentSuccessContainer.innerHTML = `

      <div class="empty-message">

        <h2>Please Login</h2>

        <p>
          Please login to verify your payment.
        </p>

        <a
          href="login.html"
          class="view-bookings-btn"
        >
          Login
        </a>

      </div>

    `;

    return;

  }


  // SHOW LOADING

  paymentSuccessContainer.innerHTML = `

    <div class="loading">

      <h2>Verifying Payment...</h2>

      <p>
        Please wait while we verify your payment.
      </p>

    </div>

  `;


  try {

    const response = await fetch(

      `${API_URL}/payment/verify?reference=${reference}`,

      {

        method: "GET",

        headers: {

          "Authorization":
            `Bearer ${token}`

        }

      }

    );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(

        data.message ||
        "Payment verification failed."

      );

    }


    console.log(
      "Payment verified:",
      data
    );


    // SHOW SUCCESS

    paymentSuccessContainer.innerHTML = `

      <div class="success-icon">

        ✓

      </div>


      <h2>Payment Successful!</h2>


      <p>

        Your payment has been successfully verified.

      </p>


      <div class="payment-details">

        <p>

          <strong>Payment Status:</strong>

          Paid

        </p>


        <p>

          <strong>Booking ID:</strong>

          ${data.bookingId}

        </p>


        <p>

          <strong>Reference:</strong>

          ${reference}

        </p>

      </div>


      <a
        href="my-bookings.html"
        class="view-bookings-btn"
      >

        View My Bookings

      </a>

    `;


  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );


    paymentSuccessContainer.innerHTML = `

      <div class="error-message">

        <h2>
          Payment Verification Failed
        </h2>


        <p>

          ${error.message}

        </p>


        <a
          href="my-bookings.html"
          class="view-bookings-btn"
        >

          Back to My Bookings

        </a>

      </div>

    `;

  }

}