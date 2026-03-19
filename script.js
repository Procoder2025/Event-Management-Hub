/* ============================================
   College Event DB - Main JavaScript
   Handles: Validation, UI Interactions, Toasts
   ============================================ */

// ---- Mobile Nav Toggle ----
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

// ---- Toast Notification ----
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast glass alert-${type}`;
  toast.innerHTML = `${type === 'success' ? '&#10003;' : '&#9888;'} ${message}`;
  document.body.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ---- File Upload Label ----
function initFileUpload() {
  const fileInput = document.getElementById('id_proof');
  if (!fileInput) return;

  fileInput.addEventListener('change', function () {
    const nameEl = this.closest('.file-upload').querySelector('.file-name');
    if (this.files.length > 0) {
      nameEl.textContent = this.files[0].name;
      nameEl.style.display = 'block';
    } else {
      nameEl.textContent = '';
      nameEl.style.display = 'none';
    }
  });
}

// ---- Form Validation ----
function validateRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    let isValid = true;

    // Clear all previous errors
    form.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

    // Name validation
    const name = form.querySelector('[name="name"]');
    if (name && name.value.trim().length < 2) {
      showFieldError(name, 'Name must be at least 2 characters');
      isValid = false;
    }

    // Email validation
    const email = form.querySelector('[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address');
      isValid = false;
    }

    // Phone validation
    const phone = form.querySelector('[name="phone"]');
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone.value.trim())) {
      showFieldError(phone, 'Please enter a valid 10-digit phone number');
      isValid = false;
    }

    // Department validation
    const dept = form.querySelector('[name="department"]');
    if (dept && dept.value === '') {
      showFieldError(dept, 'Please select your department');
      isValid = false;
    }

    // Year validation
    const year = form.querySelector('[name="year"]');
    if (year && year.value === '') {
      showFieldError(year, 'Please select your year');
      isValid = false;
    }

    // Event validation
    const event = form.querySelector('[name="event"]');
    if (event && event.value === '') {
      showFieldError(event, 'Please select an event');
      isValid = false;
    }

    // File validation (optional but check size/type if present)
    const file = form.querySelector('[name="id_proof"]');
    if (file && file.files.length > 0) {
      const f = file.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

      if (!allowedTypes.includes(f.type)) {
        showFieldError(file, 'Only JPG, PNG, or PDF files are allowed');
        isValid = false;
      } else if (f.size > maxSize) {
        showFieldError(file, 'File size must be less than 2MB');
        isValid = false;
      }
    }

    if (!isValid) {
      e.preventDefault();
      showToast('Please fix the errors in the form', 'danger');
      // Scroll to first error
      const firstError = form.querySelector('.form-control.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

// Show error for a specific field
function showFieldError(field, message) {
  field.classList.add('error');
  const errorEl = field.closest('.form-group').querySelector('.error-msg');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

// Real-time validation: clear error on input
function initRealTimeValidation() {
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function () {
      this.classList.remove('error');
      const errorEl = this.closest('.form-group')?.querySelector('.error-msg');
      if (errorEl) errorEl.style.display = 'none';
    });
  });
}

// ---- Dashboard: Search & Filter ----
function initDashboardFilters() {
  const searchInput = document.getElementById('searchInput');
  const deptFilter = document.getElementById('deptFilter');
  const eventFilter = document.getElementById('eventFilter');
  const table = document.getElementById('registrationTable');

  if (!searchInput || !table) return;

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const dept = deptFilter ? deptFilter.value.toLowerCase() : '';
    const event = eventFilter ? eventFilter.value.toLowerCase() : '';
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowDept = row.dataset.dept ? row.dataset.dept.toLowerCase() : '';
      const rowEvent = row.dataset.event ? row.dataset.event.toLowerCase() : '';

      const matchSearch = text.includes(search);
      const matchDept = !dept || rowDept === dept;
      const matchEvent = !event || rowEvent === event;

      if (matchSearch && matchDept && matchEvent) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Show empty state if no results
    const emptyRow = table.querySelector('.empty-row');
    if (visibleCount === 0 && !emptyRow) {
      const colspan = table.querySelectorAll('th').length;
      const tr = document.createElement('tr');
      tr.className = 'empty-row';
      tr.innerHTML = `<td colspan="${colspan}" style="text-align:center;padding:40px;color:var(--text-muted);">No matching records found</td>`;
      table.querySelector('tbody').appendChild(tr);
    } else if (visibleCount > 0 && emptyRow) {
      emptyRow.remove();
    }
  }

  searchInput.addEventListener('input', filterTable);
  if (deptFilter) deptFilter.addEventListener('change', filterTable);
  if (eventFilter) eventFilter.addEventListener('change', filterTable);
}

// ---- Dashboard: Export to CSV ----
function exportToCSV() {
  const table = document.getElementById('registrationTable');
  if (!table) return;

  const rows = table.querySelectorAll('tr');
  let csv = [];

  rows.forEach(row => {
    // Skip hidden rows
    if (row.style.display === 'none') return;

    const cols = row.querySelectorAll('th, td');
    const rowData = [];
    cols.forEach((col, index) => {
      // Skip the last column (Actions)
      if (index === cols.length - 1 && col.querySelector('.actions')) return;
      let text = col.textContent.trim().replace(/"/g, '""');
      rowData.push(`"${text}"`);
    });
    csv.push(rowData.join(','));
  });

  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('CSV exported successfully!', 'success');
}

// ---- Dashboard: Delete Record ----
function deleteRecord(id) {
  if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;

  // Create form and submit
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'dashboard.php';

  const actionInput = document.createElement('input');
  actionInput.type = 'hidden';
  actionInput.name = 'action';
  actionInput.value = 'delete';
  form.appendChild(actionInput);

  const idInput = document.createElement('input');
  idInput.type = 'hidden';
  idInput.name = 'record_id';
  idInput.value = id;
  form.appendChild(idInput);

  document.body.appendChild(form);
  form.submit();
}

// ---- Dashboard: Edit Modal ----
function openEditModal(id, name, email, phone, department, year, event) {
  const overlay = document.getElementById('editModal');
  if (!overlay) return;

  overlay.querySelector('[name="edit_id"]').value = id;
  overlay.querySelector('[name="edit_name"]').value = name;
  overlay.querySelector('[name="edit_email"]').value = email;
  overlay.querySelector('[name="edit_phone"]').value = phone;
  overlay.querySelector('[name="edit_department"]').value = department;
  overlay.querySelector('[name="edit_year"]').value = year;
  overlay.querySelector('[name="edit_event"]').value = event;

  overlay.classList.add('active');
}

function closeEditModal() {
  const overlay = document.getElementById('editModal');
  if (overlay) overlay.classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeEditModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeEditModal();
});

// ---- Login Form: Toggle Password Visibility ----
function initPasswordToggle() {
  const toggle = document.querySelector('.password-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    const input = this.previousElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      this.textContent = '🙈';
    } else {
      input.type = 'password';
      this.textContent = '👁';
    }
  });
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initFileUpload();
  validateRegistrationForm();
  initRealTimeValidation();
  initDashboardFilters();
  initPasswordToggle();

  // Check for URL params (success/error messages)
  const params = new URLSearchParams(window.location.search);
  if (params.get('success')) {
    showToast(decodeURIComponent(params.get('success')), 'success');
  }
  if (params.get('error')) {
    showToast(decodeURIComponent(params.get('error')), 'danger');
  }
});
