 const sidebar = document.querySelector('.sidebar');

function toggleMenu() {
    sidebar.classList.add('active');
}

function handleCloseSidebar() {
    sidebar.classList.remove('active');
}