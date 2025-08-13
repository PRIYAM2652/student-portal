window.addEventListener('DOMContentLoaded', () => {
  // Load navbar
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => document.getElementById('navbar-placeholder').innerHTML = data);

  // Get faculty name from URL
  const params = new URLSearchParams(window.location.search);
  const facultyName = params.get("name");

  // Prefill name field
  document.getElementById("facultyName").value = facultyName;

  // Fetch faculty details from backend
  fetch(`http://localhost:8080/api/faculty/get/${encodeURIComponent(facultyName)}`)
    .then(res => {
      if (!res.ok) throw new Error("Faculty not found");
      return res.json();
    })
    .then(data => {
      // Fill age field
      document.getElementById("facultyAge").value = data.age;

      // Set the selected option in the specialization dropdown
      const specializationSelect = document.getElementById("facultySpecialization");
      const options = Array.from(specializationSelect.options);
      const found = options.find(option => option.value.toLowerCase() === data.specialization.toLowerCase());

      if (found) {
        specializationSelect.value = found.value;
      } else {
        // If specialization doesn't exist in dropdown, add it and select
        const customOption = document.createElement("option");
        customOption.value = data.specialization;
        customOption.textContent = data.specialization;
        customOption.selected = true;
        specializationSelect.appendChild(customOption);
      }
    })
    .catch(err => alert("❌ " + err.message));

  // Update form submission
  document.getElementById("updateFacultyForm").addEventListener("submit", e => {
    e.preventDefault();

    const updated = {
      name: facultyName,
      age: parseInt(document.getElementById("facultyAge").value),
      specialization: document.getElementById("facultySpecialization").value
    };

    fetch(`http://localhost:8080/api/faculty/update/${encodeURIComponent(facultyName)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then(() => {
        alert("✅ Faculty updated successfully");
        window.location.href = "faculty-list.html";
      })
      .catch(e => alert("❌ " + e.message));
  });
});

function logout() {
  localStorage.removeItem("student");
  window.location.href = "index.html";
}
