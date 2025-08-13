function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageBox = document.getElementById("message");

  messageBox.innerHTML = "";
  messageBox.style.display = "none";

  if (!username || !password) {
    showMessage("Please enter username and password.", "error");
    return;
  }

  fetch("http://localhost:8080/api/student/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) {

                throw new Error("Login failed may be user name and password incorrect");

      /*  return res.text().then(text => {
          throw new Error("Login failed may be user name and password incorrect");
        });*/
      }
      return res.json();
    })
    .then(user => {
      localStorage.setItem("student", JSON.stringify(user));
      showMessage("Login successful!", "success");

      setTimeout(() => {
        window.location.href = "home.html"; // Redirect after login
      }, 1500);
    })
    .catch(err => {
      showMessage(err.message, "error");
    });

  function showMessage(message, type) {
    messageBox.innerHTML = message;
    messageBox.className = `message-box ${type}`;  // ✅ FIXED
    messageBox.style.display = "block";
  }
}
