let allFacultyData = [];
let currentPage = 1;
const itemsPerPage = 5;

function fetchFaculty() {
  fetch('http://localhost:8080/api/faculty/all')
    .then(res => res.json())
    .then(data => {
      allFacultyData = data;
      renderFacultyTable();
      renderPagination();
    });
}

function renderFacultyTable() {
  const tbody = document.getElementById("facultyTableBody");
  tbody.innerHTML = '';

  const searchTerm = (document.getElementById('searchInput').value || '').toLowerCase();
  const filtered = allFacultyData.filter(f => f.name.toLowerCase().includes(searchTerm));
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(start, start + itemsPerPage);

  pageData.forEach(faculty => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${faculty.name}</td>
      <td>${faculty.age}</td>
      <td>${faculty.specialization}</td>
      <td>
        <button class="btn btn-sm btn-edit" onclick="editFaculty('${faculty.name}')">Edit</button>
        <button class="btn btn-sm btn-delete" onclick="deleteFaculty('${faculty.name}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderPagination() {
  const searchTerm = (document.getElementById('searchInput').value || '').toLowerCase();
  const filtered = allFacultyData.filter(f => f.name.toLowerCase().includes(searchTerm));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const container = document.getElementById('paginationControls');
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const createBtn = (text, page, active = false, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'btn btn-sm mx-1';
    btn.style.borderRadius = '5px';
    btn.style.minWidth = '40px';

    if (active) {
      btn.style.backgroundColor = '#002244';
      btn.style.color = 'white';
      btn.style.border = '1px solid #002244';
    } else {
      btn.style.backgroundColor = 'white';
      btn.style.color = '#002244';
      btn.style.border = '1px solid #002244';
    }

    if (!disabled) {
      btn.onclick = () => {
        currentPage = page;
        renderFacultyTable();
        renderPagination();
      };
    } else {
      btn.disabled = true;
      btn.style.opacity = 0.6;
    }

    container.appendChild(btn);
  };

  // ✅ Prev (<<)
  createBtn('<<', Math.max(1, currentPage - 1), false, currentPage === 1);

  // ✅ Show current page, maybe 2 pages, and jump to last
  const totalPagesToShow = 2;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(startPage + totalPagesToShow - 1, totalPages);

  if (endPage - startPage < totalPagesToShow - 1) {
    startPage = Math.max(1, endPage - totalPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    createBtn(i, i, i === currentPage);
  }

  if (endPage < totalPages - 1) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.margin = '0 6px';
    dots.style.color = '#002244';
    container.appendChild(dots);
  }

  if (endPage < totalPages) {
    createBtn(totalPages, totalPages, currentPage === totalPages);
  }

  // ✅ Next (>>)
  createBtn('>>', Math.min(totalPages, currentPage + 1), false, currentPage === totalPages);
}

function editFaculty(name) {
  window.location.href = `update-faculty.html?name=${encodeURIComponent(name)}`;
}

function deleteFaculty(name) {
  const tbody = document.getElementById("facultyTableBody");
  const rows = [...tbody.rows];

  rows.forEach(row => {
    const nameCell = row.cells[0];
    if (nameCell.textContent.trim() === name) {
      row.cells[3].innerHTML = `
        <button class="btn btn-sm btn-secondary mr-2" onclick="cancelDelete()">No</button>
        <button class="btn btn-sm btn-danger" onclick="confirmDelete('${name}')">Yes</button>
      `;
    }
  });
}

function cancelDelete() {
  renderFacultyTable();
}

function confirmDelete(name) {
  fetch(`http://localhost:8080/api/faculty/delete/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(errMsg => { throw new Error(errMsg); });
      }
      return res.text();
    })
    .then(msg => {
      const msgBox = document.getElementById("deleteMessage");
      msgBox.textContent = "✅ " + msg;
      msgBox.style.color = "green";
      msgBox.style.display = "block";

      fetchFaculty(); // Reload table

      setTimeout(() => {
        msgBox.style.display = "none";
      }, 2500);
    })
    .catch(err => {
      const msgBox = document.getElementById("deleteMessage");
      msgBox.textContent = "❌ " + err.message;
      msgBox.style.color = "red";
      msgBox.style.display = "block";
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchFaculty();
  document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    renderFacultyTable();
    renderPagination();
  });
});
