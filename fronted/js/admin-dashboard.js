const API_URL = "http://localhost:5000/api";


// REQUIRE ADMIN

function requireAdmin() {

  const token = localStorage.getItem("token");

  const userData = localStorage.getItem("user");


  if (!token || !userData) {

    alert("Please login first.");

    window.location.href = "login.html";

    return false;

  }


  let user;


  try {

    user = JSON.parse(userData);

  } catch (error) {

    console.error("Invalid user data:", error);

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

    return false;

  }


  if (user.role !== "admin") {

    alert("Access denied. Admin only.");

    window.location.href = "index.html";

    return false;

  }


  return true;

}


// GET TOKEN

const token = localStorage.getItem("token");


// GET ELEMENTS

const pricesContainer =
  document.getElementById("pricesContainer");


const adminBookingsContainer =
  document.getElementById(
    "adminBookingsContainer"
  );


const totalPrices =
  document.getElementById("totalPrices");


const totalBookings =
  document.getElementById("totalBookings");


const pendingBookings =
  document.getElementById("pendingBookings");


const paidBookings =
  document.getElementById("paidBookings");


const addPriceBtn =
  document.getElementById("addPriceBtn");


const priceModal =
  document.getElementById("priceModal");


const closeModal =
  document.getElementById("closeModal");


const priceForm =
  document.getElementById("priceForm");


const priceId =
  document.getElementById("priceId");


const priceRideType =
  document.getElementById("priceRideType");


const priceAmount =
  document.getElementById("priceAmount");


const modalTitle =
  document.getElementById("modalTitle");


const logoutBtn =
  document.getElementById("logoutBtn");


const adminName =
  document.getElementById("adminName");


// AUTH HEADERS

function getHeaders() {

  return {

    "Content-Type": "application/json",

    "Authorization":
      `Bearer ${token}`

  };

}


// DISPLAY ADMIN NAME

function displayAdminName() {

  const userData =
    localStorage.getItem("user");


  if (!userData) return;


  try {

    const user =
      JSON.parse(userData);


    if (adminName) {

      adminName.textContent =
        user.fullname ||
        user.name ||
        "Admin";

    }


  } catch (error) {

    console.error(
      "Error displaying admin name:",
      error
    );

  }

}


// LOAD PRICES

async function loadPrices() {

  try {

    const response =
      await fetch(

        `${API_URL}/prices`,

        {

          method: "GET",

          headers: getHeaders()

        }

      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(

        data.message ||
        "Failed to load prices"

      );

    }


    const prices =
      data.prices || [];


    displayPrices(prices);


    if (totalPrices) {

      totalPrices.textContent =
        prices.length;

    }


  } catch (error) {

    console.error(
      "Load prices error:",
      error
    );


    if (pricesContainer) {

      pricesContainer.innerHTML = `

        <div class="empty-message">

          <p>
            ${error.message}
          </p>

        </div>

      `;

    }

  }

}


// DISPLAY PRICES

function displayPrices(prices) {


  if (!prices || prices.length === 0) {

    pricesContainer.innerHTML = `

      <div class="empty-message">

        <h3>No Prices Yet</h3>

        <p>
          No ride prices have been created yet.
        </p>

      </div>

    `;

    return;

  }


  pricesContainer.innerHTML =
    prices.map((price) => `

      <div class="price-card">


        <h3>

          ${price.rideType}

        </h3>


        <p class="price">

          ₦${Number(
            price.amount
          ).toLocaleString("en-NG")}

        </p>


        <div class="price-actions">


          <button
            class="edit-price-btn"
            data-id="${price._id}"
            data-ride-type="${price.rideType}"
            data-amount="${price.amount}"
          >

            Edit Price

          </button>


          <button
            class="delete-price-btn"
            data-id="${price._id}"
          >

            Delete Price

          </button>


        </div>


      </div>

    `).join("");



  // EDIT BUTTON EVENTS

  const editButtons =
    document.querySelectorAll(
      ".edit-price-btn"
    );


  editButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        editPrice(

          button.dataset.id,

          button.dataset.rideType,

          button.dataset.amount

        );

      }
    );

  });



  // DELETE BUTTON EVENTS

  const deleteButtons =
    document.querySelectorAll(
      ".delete-price-btn"
    );


  deleteButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        deletePrice(
          button.dataset.id
        );

      }
    );

  });

}


// OPEN ADD PRICE MODAL

if (addPriceBtn) {

  addPriceBtn.addEventListener(
    "click",
    () => {

      priceForm.reset();

      priceId.value = "";

      modalTitle.textContent =
        "Add New Price";


      priceModal.style.display =
        "flex";

    }
  );

}


// CLOSE MODAL

if (closeModal) {

  closeModal.addEventListener(
    "click",
    () => {

      priceModal.style.display =
        "none";

    }
  );

}


// CLOSE MODAL WHEN CLICKING OUTSIDE

window.addEventListener(
  "click",
  (event) => {

    if (event.target === priceModal) {

      priceModal.style.display =
        "none";

    }

  }
);


// CREATE OR UPDATE PRICE

if (priceForm) {

  priceForm.addEventListener(

    "submit",

    async (event) => {

      event.preventDefault();


      const rideType =
        priceRideType.value.trim();


      const amount =
        Number(priceAmount.value);


      if (!rideType) {

        alert(
          "Please enter a ride type."
        );

        return;

      }


      if (!amount || amount <= 0) {

        alert(
          "Please enter a valid price."
        );

        return;

      }


      try {

        let response;


        // UPDATE PRICE

        if (priceId.value) {

          response =
            await fetch(

              `${API_URL}/prices/${priceId.value}`,

              {

                method: "PUT",

                headers: getHeaders(),

                body: JSON.stringify({

                  rideType,
                  amount

                })

              }

            );

        }


        // CREATE PRICE

        else {

          response =
            await fetch(

              `${API_URL}/prices`,

              {

                method: "POST",

                headers: getHeaders(),

                body: JSON.stringify({

                  rideType,
                  amount

                })

              }

            );

        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(

            data.message ||
            "Failed to save price"

          );

        }


        if (priceId.value) {

          alert(
            "Price updated successfully!"
          );

        } else {

          alert(
            "Price created successfully!"
          );

        }


        priceModal.style.display =
          "none";


        priceForm.reset();


        priceId.value = "";


        loadPrices();


      } catch (error) {

        console.error(
          "Price error:",
          error
        );


        alert(error.message);

      }

    }

  );

}


// EDIT PRICE

function editPrice(
  id,
  rideType,
  amount
) {

  priceId.value =
    id;


  priceRideType.value =
    rideType;


  priceAmount.value =
    amount;


  modalTitle.textContent =
    "Edit Price";


  priceModal.style.display =
    "flex";

}


// DELETE PRICE

async function deletePrice(id) {

  const confirmDelete =
    confirm(
      "Are you sure you want to delete this price?"
    );


  if (!confirmDelete) {

    return;

  }


  try {

    const response =
      await fetch(

        `${API_URL}/prices/${id}`,

        {

          method: "DELETE",

          headers: getHeaders()

        }

      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(

        data.message ||
        "Failed to delete price"

      );

    }


    alert(
      "Price deleted successfully!"
    );


    // RELOAD PRICES

    loadPrices();


  } catch (error) {

    console.error(
      "Delete price error:",
      error
    );


    alert(

      error.message ||
      "Failed to delete price"

    );

  }

}


// LOAD BOOKINGS

async function loadBookings() {

  try {

    const response =
      await fetch(

        `${API_URL}/bookings`,

        {

          method: "GET",

          headers: getHeaders()

        }

      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(

        data.message ||
        "Failed to load bookings"

      );

    }


    const bookings =
      data.bookings || [];


    displayBookings(bookings);


    // UPDATE STATISTICS

    if (totalBookings) {

      totalBookings.textContent =
        bookings.length;

    }


    if (pendingBookings) {

      pendingBookings.textContent =

        bookings.filter(

          (booking) =>

            String(
              booking.status
            ).toLowerCase() ===
            "pending"

        ).length;

    }


    if (paidBookings) {

      paidBookings.textContent =

        bookings.filter(

          (booking) =>

            String(
              booking.paymentStatus
            ).toLowerCase() ===
            "paid"

        ).length;

    }


  } catch (error) {

    console.error(
      "Load bookings error:",
      error
    );


    if (adminBookingsContainer) {

      adminBookingsContainer.innerHTML = `

        <div class="empty-message">

          <p>
            ${error.message}
          </p>

        </div>

      `;

    }

  }

}


// DISPLAY BOOKINGS

function displayBookings(bookings) {


  if (!bookings || bookings.length === 0) {

    adminBookingsContainer.innerHTML = `

      <div class="empty-message">

        <h3>No Bookings Yet</h3>

        <p>
          Customer bookings will appear here
          after they create a booking.
        </p>

      </div>

    `;

    return;

  }


  adminBookingsContainer.innerHTML =
    bookings.map((booking) => {


      let formattedDate =
        "Not available";


      if (booking.bookingDate) {

        formattedDate =
          new Date(
            booking.bookingDate
          ).toLocaleDateString(
            "en-NG"
          );

      }


      const price =
        Number(
          booking.price || 0
        );


      return `

        <div class="booking-card">


          <div class="booking-header">


            <h3>

              ${booking.rideType || "Ride"}

            </h3>


            <span class="booking-status">

              ${booking.status || "pending"}

            </span>


          </div>


          <div class="booking-details">


            <p>

              <strong>Pickup:</strong>

              ${booking.pickupLocation || "Not available"}

            </p>


            <p>

              <strong>Destination:</strong>

              ${booking.destination || "Not available"}

            </p>


            <p>

              <strong>Date:</strong>

              ${formattedDate}

            </p>


            <p>

              <strong>Time:</strong>

              ${booking.bookingTime || "Not available"}

            </p>


            <p>

              <strong>Passengers:</strong>

              ${booking.passengers || "Not available"}

            </p>


            <p>

              <strong>Price:</strong>

              ₦${price.toLocaleString("en-NG")}

            </p>


            <p>

              <strong>Booking Status:</strong>

              ${booking.status || "pending"}

            </p>


            <p>

              <strong>Payment:</strong>

              ${booking.paymentStatus || "pending"}

            </p>


          </div>


        </div>

      `;

    }).join("");

}


// LOGOUT

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    () => {


      const confirmLogout =
        confirm(
          "Are you sure you want to logout?"
        );


      if (!confirmLogout) {

        return;

      }


      localStorage.removeItem(
        "token"
      );


      localStorage.removeItem(
        "user"
      );


      window.location.href =
        "login.html";

    }
  );

}


// INITIALIZE ADMIN DASHBOARD

function initializeAdminDashboard() {


  if (!requireAdmin()) {

    return;

  }


  displayAdminName();


  loadPrices();


  loadBookings();

}


// START DASHBOARD

initializeAdminDashboard();