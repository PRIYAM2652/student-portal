function register() {
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const phoneNumber = document.getElementById("phone").value;

  const statusDiv = document.getElementById("register-status");
  statusDiv.innerText = ""; // Clear previous message

  fetch("http://localhost:8080/api/student/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, username, password, age, gender, phoneNumber }) // ✅ fixed here
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      return res.text();
    })
    .then(msg => {
      // ✅ Store student data locally for profile page
      const student = { name, username, age, gender, phoneNumber };
      localStorage.setItem("student", JSON.stringify(student));

      statusDiv.innerText = msg;
      statusDiv.className = "success-message";

      // Optional: redirect to profile after short delay
      // setTimeout(() => {
      //   window.location.href = "profile.html";
      // }, 1000);
    })
    .catch(err => {
      console.error("Register error:", err);
      statusDiv.innerText = "Registration failed.";
      statusDiv.className = "error-message";
    });
}
