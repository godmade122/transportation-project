function getToken() {
    return localStorage.getItem('token');
}

function saveToken(token) {
    localStorage.setItem('token', token);
} 

function getRole() {
    return localStorage.getItem('role');
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    localStorage.clear();
    location.href = 'login.html';
}

function authHeader() {
    return {
        Authorization: `Bearer ${getToken()}`
    }
}

function requireLogin() {
    if (!isLoggedIn()) {
        location.href = 'login.html';
    }
}

function requireAdmin() {
    requireLogin();

    if(getRole() !== 'admin') {
        alert('Access Denied');
        location.href = 'events.html'
    }
}