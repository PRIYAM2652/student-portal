window.addEventListener('DOMContentLoaded', () => {
  // Load navbar
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;

      // Wait for DOM update
      requestAnimationFrame(() => highlightActiveNav());
    });

  // Load footer
  const footer = document.getElementById('footer-placeholder');
  if (footer) {
    fetch('components/footer.html')
      .then(res => res.text())
      .then(data => footer.innerHTML = data);
  }
});

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function logout() {
  localStorage.removeItem("student");
  window.location.href = "index.html";
}
