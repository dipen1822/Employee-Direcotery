let employeesData = [];

fetch('modal.html')
  .then(response => response.text())
  .then(modalHtml => {
    document.getElementById('modalContainer').innerHTML = modalHtml;
  });

fetch('employee.json')
  .then(response => response.json())
  .then(data => {
    employeesData = data;

    const select = document.getElementById('select');
    select.innerHTML = '<option value="">All Departments</option>';
    const uniqueDepts = [...new Set(data.map(emp => emp.department))];
    uniqueDepts.forEach(dept => {
      select.innerHTML += `<option value="${dept}">${dept}</option>`;
    });

    restoreFilters();

    applyFilters();
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

document.getElementById('search').addEventListener('input', function () {
  localStorage.setItem('searchTerm', this.value);
  applyFilters();
});

document.getElementById('select').addEventListener('change', function () {
  localStorage.setItem('selectedDept', this.value);
  applyFilters();
});

function restoreFilters() {
  const savedSearch = localStorage.getItem('searchTerm');
  const savedDept = localStorage.getItem('selectedDept');

  if (savedSearch !== null) {
    document.getElementById('search').value = savedSearch;
  }

  if (savedDept !== null) {
    document.getElementById('select').value = savedDept;
  }
}

function applyFilters() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  const selectedDept = document.getElementById('select').value;

  const filtered = employeesData.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(searchValue);
    const matchesDept = selectedDept === '' || emp.department === selectedDept;
    return matchesName && matchesDept;
  });

  renderCards(filtered);
}

function renderCards(data) {
  const container = document.getElementById('employeeContainer');
  container.innerHTML = '';

  data.forEach(employee => {
    const card = document.createElement('div');
    card.className = 'col-12 col-lg-12 card';

    card.innerHTML = `
        <div>
        <img src="${employee.image}" alt="${employee.name}" class="img-fluid">
        </div>
        <h2>${employee.name}</h2>
        <h3 id="dept">${employee.department}</h3>
        <button class="btn btn-primary mt-2 view-more" data-bs-toggle="modal" data-bs-target="#employeeModal">
            <h4>View More</h4>
        </button>
    `;

    container.appendChild(card);

    const viewMoreBtn = card.querySelector('.view-more');
    viewMoreBtn.addEventListener('click', () => {
      document.getElementById('modalBody').innerHTML = `
        <div class="text-center">
          <img src="${employee.image}" class="img-fluid rounded mb-3" style="width:150px;height:150px;">
        </div>
        <h5><strong>Name:</strong> ${employee.name}</h5>
        <h5><strong>Department:</strong> ${employee.department}</h5>
        <h5><strong>Email:</strong> ${employee.email}</h5>
        <h5><strong>Phone:</strong> ${employee.contact}</h5>
      `;
    });
  });
}
