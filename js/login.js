// Get login form
const loginForm = document.getElementById("loginform");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    console.log("Login button clicked");

    // Get input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Basic validation
    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {

        console.log("Sending login request...");

        const response = await fetch(
            `${API_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        console.log("Login response:", data);

        // Check if login failed
        if (!response.ok) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        // Save JWT token
        localStorage.setItem(
            "token",
            data.token
        );

        // Save user information
        if (data.user) {
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );
        }

        alert("Login successful!");

        // Redirect admin
        if (
            data.user &&
            data.user.role === "admin"
        ) {
            window.location.href =
                "admin-dashboard.html";
        }

        // Redirect normal user
        else {
            window.location.href =
                "booking.html";
        }

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            error.message || "Something went wrong."
        );
    }
});