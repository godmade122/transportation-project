function renderNavbar() {
    const nav = document.querySelector('.nav-links');
    if(!nav) return;

    if(!isLoggedIn()) {
        nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="events.html">Events</a>
        <a href="login.html">Login</a>
        <a class="btn" href="register.html">Register</a>
        `;

        return;
    }

    if(!getRole() === 'admin') {
        nav.innerHTML = `
        <a href="admin-dashboard.html">Dashboard</a>
        <a href="create-event.html">Create Event</a>
        <button class="btn" onclick="logout">Logout</button>
        `;

        return;
    }

    nav.innerHTML = `
      <a href="events.html">Events</a>
      <a href="my-bookings.html">My Bookings</a>
      <button class="btn" onclick="logout">Logout</button>
    `;
}

renderNavbar();