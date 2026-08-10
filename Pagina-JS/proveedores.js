/**
 * proveedores.js — CRUD de Proveedores
 * Sistema Administrativo Web · Dali Medica
 */

verificarSesion(['admin', 'empleado']);

const providerForm = document.getElementById('providerForm');
const providerList = document.getElementById('providerList');
const searchInput = document.getElementById('searchProvider');
const paginationControls = document.getElementById('paginationControls');

let providers = JSON.parse(localStorage.getItem('dali_providers') || '[]');
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;
let currentSearch = '';

function saveProviders() {
  localStorage.setItem('dali_providers', JSON.stringify(providers));
}

function renderProviders() {
  const filtered = providers.filter(p => {
    const query = currentSearch.toLowerCase();
    return p.name.toLowerCase().includes(query) ||
           p.contact.toLowerCase().includes(query) ||
           p.email.toLowerCase().includes(query) ||
           p.phone.includes(query);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filtered.slice(start, end);

  providerList.innerHTML = '';
  pageItems.forEach((provider, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${provider.name}</td>
      <td>${provider.contact}</td>
      <td>${provider.email}</td>
      <td>${provider.phone}</td>
      <td>${provider.notes || ''}</td>
      <td class="actions">
        <button onclick="editProvider('${provider.id || index}')">Editar</button>
        <button onclick="deleteProvider('${provider.id || index}')">Eliminar</button>
      </td>
    `;
    providerList.appendChild(row);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (!paginationControls) return;
  paginationControls.innerHTML = '';
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Anterior';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { currentPage--; renderProviders(); };
  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Siguiente';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { currentPage++; renderProviders(); };
  
  const spanInfo = document.createElement('span');
  spanInfo.textContent = ` Página ${currentPage} de ${totalPages} `;
  spanInfo.style.margin = '0 10px';

  paginationControls.appendChild(prevBtn);
  paginationControls.appendChild(spanInfo);
  paginationControls.appendChild(nextBtn);
}

function editProvider(id) {
  const index = providers.findIndex(p => p.id === id || String(p.id) === String(id));
  if (index === -1) return;
  const provider = providers[index];
  editingId = id;
  document.getElementById('providerId').value = id;
  document.getElementById('providerName').value = provider.name;
  document.getElementById('providerContact').value = provider.contact;
  document.getElementById('providerEmail').value = provider.email;
  document.getElementById('providerPhone').value = provider.phone;
  document.getElementById('providerNotes').value = provider.notes || '';
}

function deleteProvider(id) {
  if (!confirm('¿Eliminar este proveedor?')) return;
  const index = providers.findIndex(p => p.id === id || String(p.id) === String(id));
  if (index !== -1) {
    providers.splice(index, 1);
    saveProviders();
    renderProviders();
  }
}

if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    currentSearch = e.target.value;
    currentPage = 1;
    renderProviders();
  });
}

providerForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const provider = {
    name: document.getElementById('providerName').value.trim(),
    contact: document.getElementById('providerContact').value.trim(),
    email: document.getElementById('providerEmail').value.trim(),
    phone: document.getElementById('providerPhone').value.trim(),
    notes: document.getElementById('providerNotes').value.trim(),
  };

  if (editingId) {
    const index = providers.findIndex(p => p.id === editingId || String(p.id) === String(editingId));
    if (index !== -1) {
      providers[index] = { ...providers[index], ...provider };
    }
  } else {
    provider.id = Date.now().toString();
    providers.push(provider);
  }

  saveProviders();
  renderProviders();
  providerForm.reset();
  editingId = null;
  document.getElementById('providerId').value = '';
});

renderProviders();