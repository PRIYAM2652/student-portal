window.addEventListener('DOMContentLoaded', () => {
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => document.getElementById('navbar-placeholder').innerHTML = data);

  fetch('components/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer-placeholder').innerHTML = data);

  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id');

  fetch(`http://localhost:8080/api/enrollment/${studentId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('studentName').value = data.studentName;
      document.getElementById('course').value = data.course;
      document.getElementById('duration').value = data.duration;
      loadFaculty(data.faculty.id);
    });

  function loadFaculty(selectedId) {
    fetch('http://localhost:8080/api/faculty/all')
      .then(res => res.json())
      .then(data => {
        const facultySelect = document.getElementById('facultySelect');
        facultySelect.innerHTML = '<option value="" disabled>Select Faculty</option>';
        data.forEach(faculty => {
          const option = document.createElement('option');
          option.value = faculty.id;
          option.textContent = faculty.name;
          if (faculty.id === selectedId) option.selected = true;
          facultySelect.appendChild(option);
        });
      });
  }

  document.getElementById('updateForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const updatedData = {
      course: document.getElementById('course').value,
      duration: document.getElementById('duration').value,
      facultyId: document.getElementById('facultySelect').value
    };

    fetch(`http://localhost:8080/api/enrollment/update/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.text())
    .then(msg => {
      const msgBox = document.getElementById("updateMessage");
      msgBox.style.display = "block";
      msgBox.textContent = "✅ " + msg;
      setTimeout(() => {
        window.location.href = "enrollment.html";
      }, 1500);
    })
    .catch(err => {
      console.error("Update failed:", err);
    });
  });
});
