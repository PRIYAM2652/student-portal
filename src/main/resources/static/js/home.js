// home.js — ONLY for home page–specific scripts

window.addEventListener('DOMContentLoaded', () => {
  console.log("🏠 Home page loaded.");

  // ✨ Example: Add dynamic welcome message
  const mainHeading = document.querySelector('.main-content h1');
  if (mainHeading) {
    mainHeading.textContent = "Welcome to KIIT SAP Portal";
  }

  // TODO: You can add banner sliders, animations, or other home-specific logic here.
});
