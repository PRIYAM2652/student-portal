let currentPage = 1;
const itemsPerPage = 5;
let studentData = [];
let filteredData = [];

window.addEventListener('DOMContentLoaded', () => {
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => document.getElementById('navbar-placeholder').innerHTML = data);

  fetch('components/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer-placeholder').innerHTML = data);

  fetch('http://localhost:8080/api/enrollment/all')
    .then(res => res.json())
    .then(data => {
      studentData = [...data].reverse();
      applySearchFilter();
    });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applySearchFilter();
    });
  }
});

function applySearchFilter() {
  const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
  filteredData = studentData.filter(student =>
    (student.student?.name || student.studentName || '').toLowerCase().includes(searchTerm)
  );
  renderTable();
  renderPagination();
}

function renderTable() {
  const tableBody = document.getElementById('existingStudentTableBody');
  tableBody.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);

  pageData.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.student?.name || student.studentName || 'N/A'}</td>
      <td>${student.course}</td>
      <td>${student.duration}</td>
      <td>${student.faculty?.name || 'N/A'}</td>
      <td id="action-cell-${student.id}">
        <button class="btn-edit mr-2" onclick="editStudent(${student.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="confirmPrompt(${student.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const container = document.getElementById('paginationControls');
  container.innerHTML = '';
  container.className = 'text-right';

  const createBtn = (text, page, active = false, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'pagination-btn'; // Use custom class for styling

    if (active) {
      btn.classList.add('btn-dark');
    }

    if (!disabled) {
      btn.onclick = () => {
        currentPage = page;
        renderTable();
        renderPagination();
      };
    } else {
      btn.disabled = true;
    }

    container.appendChild(btn);
  };

  createBtn('<<', Math.max(1, currentPage - 1), false, currentPage === 1);

  for (let i = 1; i <= totalPages; i++) {
    createBtn(i, i, i === currentPage);
  }

  createBtn('>>', Math.min(totalPages, currentPage + 1), false, currentPage === totalPages);
}

function editStudent(id) {
  window.location.href = `update.html?id=${id}`;
}

function confirmPrompt(id) {
  const cell = document.getElementById(`action-cell-${id}`);
  cell.innerHTML = `
    <button class="btn btn-sm btn-secondary mr-2" onclick="cancelDelete()">No</button>
    <button class="btn btn-sm btn-danger" onclick="deleteStudent(${id})">Yes</button>
  `;
}

function cancelDelete() {
  renderTable();
}

function deleteStudent(id) {
  fetch(`http://localhost:8080/api/enrollment/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(text || 'Failed to delete student');
        });
      }
      return res.text();
    })
    .then(() => {
      const messageBox = document.getElementById("deleteMessage");
      messageBox.textContent = "✅ Record deleted successfully!";
      messageBox.classList.remove("text-danger");
      messageBox.classList.add("text-success");

      setTimeout(() => {
        messageBox.textContent = "";
      }, 3000);

      return fetch('http://localhost:8080/api/enrollment/all');
    })
    .then(res => res.json())
    .then(data => {
      studentData = [...data].reverse();
      applySearchFilter();
    })
    .catch(err => {
      const messageBox = document.getElementById("deleteMessage");
      messageBox.textContent = "❌ " + err.message;
      messageBox.classList.remove("text-success");
      messageBox.classList.add("text-danger");
    });
}
