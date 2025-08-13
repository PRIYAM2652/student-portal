document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("facultyForm");
  const nameInput = document.getElementById("facultyName");
  const ageInput = document.getElementById("facultyAge");
  const specInput = document.getElementById("facultySpecialization");
  const msgBox = document.getElementById("facultyMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const faculty = {
      name: nameInput.value.trim(),
      age: parseInt(ageInput.value),
      specialization: specInput.value.trim()
    };

    if (!faculty.name || isNaN(faculty.age) || !faculty.specialization) {
      msgBox.textContent = "❌ Please fill all fields.";
      msgBox.style.color = "red";
      msgBox.style.display = "block";
      return;
    }

    fetch("http://localhost:8080/api/faculty/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faculty)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add");
        return res.json();
      })
      .then(() => {
        msgBox.textContent = "✅ Faculty added successfully!";
        msgBox.style.color = "green";
        msgBox.style.display = "block";

        // Clear inputs
        nameInput.value = "";
        ageInput.value = "";
        specInput.value = "";

        setTimeout(() => {
          msgBox.style.display = "none";
        }, 3000);
      })
      .catch(() => {
        msgBox.textContent = "❌ Failed to add faculty.";
        msgBox.style.color = "red";
        msgBox.style.display = "block";
      });
  });
});
