// if(isLoggedIn()){
//   location.href="events.html";
// }

// const form = document.getElementById("registerForm");
// form.addEventListener("submit", async(e)=> {
//   e.preventDefault();
//   const body={
//     fullname: document.getElementById("fullname").value,
//     email: document.getElementById("email").value,
//     password: document.getElementById("password").value
//   };

//   const response = await fetch(`${API_BASE_URL}/auth/register`,
//     {
//       method:"POST",
//       headers:{
//         "Content-Type": "application/json"
//       },
//       body:JSON.stringify(body)
//     }
//   );

//   const data = await response.json();
//   alert(data.message);

//   if(response.ok){
//     location.href="login.html";
//   }
// });

const API_URL = "http://localhost:5000/api";

// Get the registration form
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("Register button clicked");

  // Get form values
  const name = document.getElementById("fullname").value.trim();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;


  // Basic validation
  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }


  // Password validation
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }


  try {
    console.log("Sending registration request...");

    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          fullname: name,
          email,
          password
        })
      }
    );


    const data = await response.json();

    console.log("Registration response:", 
    data);
//     const contentType = response.headers.get("content-type");

// let data;

// if (contentType && contentType.includes("application/json")) {
//   data = await response.json();
// } else {
//   const text = await response.text();

//   console.error("Server returned non-JSON:", text);

//   throw new Error(
//     "Server error. Check your backend terminal."
//   );
// }


    // Registration failed
    if (!response.ok) {
      throw new Error(
        data.message || "Registration failed"
      );
    }


    alert("Account created successfully! Please login.");

    // Reset form
    registerForm.reset();

    // Redirect to login page
    window.location.href = "login.html";


  } catch (error) {
    console.error("Registration error:", error);

    alert(
      error.message || "Something went wrong."
    );
  }

});