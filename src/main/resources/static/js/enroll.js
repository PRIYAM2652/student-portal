let facultyMap = {}; // name -> id

window.addEventListener('DOMContentLoaded', () => {
  // Load Navbar
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;
      highlightActiveNav();
    });

  // Load Footer
  fetch('components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });

  // Load faculty list
  fetch('http://localhost:8080/api/faculty/all')
    .then(res => res.json())
    .then(data => {
      const facultySelect = document.getElementById('facultySelect');
      facultySelect.innerHTML = `<option value="" disabled selected>Select Faculty</option>`;
      data.forEach(faculty => {
        facultyMap[faculty.name] = faculty.id;
        const option = document.createElement('option');
        option.value = faculty.name;
        option.textContent = faculty.name;
        facultySelect.appendChild(option);
      });
    })
    .catch(() => {
      const facultySelect = document.getElementById('facultySelect');
      facultySelect.innerHTML = `<option disabled selected>Error loading faculty list</option>`;
    });

  // Handle form submission
  const enrollForm = document.getElementById('enrollForm');
  enrollForm.addEventListener('submit', e => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const course = document.getElementById('course').value;
    const duration = document.getElementById('duration').value;
    const facultyName = document.getElementById('facultySelect').value;
    const facultyId = facultyMap[facultyName];

    if (!facultyId) {
      showMessage("❌ Please select a valid faculty", "danger");
      return;
    }

    const payload = {
      studentName,
      course,
      duration,
      facultyId
    };

    fetch('http://localhost:8080/api/enrollment/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            // Custom error message logic
            if (text.includes("Student not found")) {
              throw new Error("❌ Student not found");
            } else {
              throw new Error("❌ Failed to enroll student");
            }
          });
        }
        return res.text();
      })
      .then(() => {
        showMessage("✅ Student enrolled successfully!", "success");
        enrollForm.reset();
      })
      .catch(err => {
        showMessage(err.message, "danger");
      });
  });
});

function showMessage(message, type) {
  const msgBox = document.getElementById("enrollMessage");
  msgBox.textContent = message;
  msgBox.className = "";
  msgBox.classList.add("font-weight-bold", "mt-3", `text-${type}`);
  msgBox.style.display = "block";
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop().toLowerCase();
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
