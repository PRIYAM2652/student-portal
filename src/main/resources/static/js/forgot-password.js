function resetPassword() {
    const username = document.getElementById("username").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    fetch("http://localhost:8080/api/student/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    })
    .then(response => {
        if (response.ok) {
            alert("Password updated successfully!");
            window.location.href = "login.html";
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
}
