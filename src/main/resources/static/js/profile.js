// Load navbar and footer dynamically
fetch("components/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;
  });

fetch("components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });

// Populate user info and add gender-based profile image
window.addEventListener('DOMContentLoaded', () => {
  const student = JSON.parse(localStorage.getItem("student"));

  if (!student) {
    document.getElementById("profileInfo").innerHTML =
      "<p>No user data found. Please <a href='index.html'>login</a>.</p>";
    return;
  }

  const phone = student.phone || student.phoneNumber || "Not provided";

  // Create and insert profile photo
  const img = document.createElement("img");
  img.id = "profile-photo";

  if (student.gender && student.gender.toLowerCase() === "male") {
    img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16eO5W8VPjVFrkvG8n_2FQKjByMcbLtBF4A&s";
  } else if (student.gender && student.gender.toLowerCase() === "female") {
    img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKb5B_aLbXOpeHLmqaP8jOqMOfwVal7TXQsQ&s";
  } else {
    img.src = "images/default-avatar.png";
  }

  const profileInfo = document.getElementById("profileInfo");
  profileInfo.innerHTML = ''; // Clear old content
  profileInfo.appendChild(img); // Add photo

  profileInfo.innerHTML += `
    <p><strong>Name:</strong> ${student.name}</p>
    <p><strong>Username:</strong> ${student.username}</p>
    <p><strong>Gender:</strong> ${student.gender}</p>
    <p><strong>Age:</strong> ${student.age}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <br>
    <button onclick="logout()">Logout</button>
  `;
});

// Logout function
function logout() {
  localStorage.removeItem("student");
  window.location.href = "index.html";
}
