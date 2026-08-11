/**
 * proveedores.js — CRUD de Proveedores
 * Sistema Administrativo Web · Dali Medica
 */

verificarSesion(['admin']);

const providerForm = document.getElementById('providerForm');
const providerList = document.getElementById('providerList');
const searchInput = document.getElementById('searchProvider');
const paginationControls = document.getElementById('paginationControls');
const csvFileInput = document.getElementById('csvFileInput');

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
    const rowId = provider.id || String(index);
    if (editingId && editingId === rowId) {
      row.innerHTML = `
        <td><input id="edit-provider-name-${rowId}" type="text" value="${provider.name}" style="width:100%;"></td>
        <td><input id="edit-provider-contact-${rowId}" type="text" value="${provider.contact}" style="width:100%;"></td>
        <td><input id="edit-provider-email-${rowId}" type="email" value="${provider.email}" style="width:100%;"></td>
        <td><input id="edit-provider-phone-${rowId}" type="text" value="${provider.phone}" style="width:100%;"></td>
        <td><input id="edit-provider-notes-${rowId}" type="text" value="${provider.notes || ''}" style="width:100%;"></td>
        <td class="actions">
          <button type="button" onclick="saveInlineProvider('${rowId}')">Guardar</button>
          <button type="button" onclick="cancelInlineProvider()">Cancelar</button>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td>${provider.name}</td>
        <td>${provider.contact}</td>
        <td>${provider.email}</td>
        <td>${provider.phone}</td>
        <td>${provider.notes || ''}</td>
        <td class="actions">
          <button type="button" onclick="startInlineProvider('${rowId}')">Editar</button>
          <button type="button" onclick="deleteProvider('${rowId}')">Eliminar</button>
        </td>
      `;
    }
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
  startInlineProvider(id);
}

function startInlineProvider(id) {
  editingId = id;
  renderProviders();
}

function cancelInlineProvider() {
  editingId = null;
  renderProviders();
}

function saveInlineProvider(id) {
  const name = document.getElementById(`edit-provider-name-${id}`).value.trim();
  const contact = document.getElementById(`edit-provider-contact-${id}`).value.trim();
  const email = document.getElementById(`edit-provider-email-${id}`).value.trim();
  const phone = document.getElementById(`edit-provider-phone-${id}`).value.trim();
  const notes = document.getElementById(`edit-provider-notes-${id}`).value.trim();

  if (!name || !contact || !email) {
    alert('Nombre, contacto y correo son obligatorios.');
    return;
  }

  const index = providers.findIndex(p => p.id === id || String(p.id) === String(id));
  if (index === -1) return;

  providers[index] = {
    ...providers[index],
    name,
    contact,
    email,
    phone,
    notes
  };

  saveProviders();
  editingId = null;
  renderProviders();
}

async function deleteProvider(id) {
  let ok = false;
  const message = '¿Eliminar este proveedor?';
  if (typeof showConfirm === 'function') ok = await showConfirm(message);
  else if (typeof modalConfirm === 'function') ok = await modalConfirm(message);
  else {
    ok = await new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style = 'position:fixed;inset:0;background:rgba(2,6,23,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;';
      const box = document.createElement('div'); box.style='max-width:420px;padding:16px;border-radius:10px;background:#071226;color:#fff;border:1px solid rgba(255,255,255,0.04);';
      const m = document.createElement('div'); m.style.marginBottom='12px'; m.textContent = message;
      const btns = document.createElement('div'); btns.style.display='flex'; btns.style.justifyContent='flex-end'; btns.style.gap='8px';
      const btnCancel = document.createElement('button'); btnCancel.textContent='Cancelar'; const btnOk = document.createElement('button'); btnOk.textContent='Aceptar'; btnOk.style.background='#00b4ff'; btnOk.style.border='none'; btnOk.style.color='#021020';
      btns.appendChild(btnCancel); btns.appendChild(btnOk); box.appendChild(m); box.appendChild(btns); overlay.appendChild(box); document.body.appendChild(overlay);
      btnOk.addEventListener('click', () => { document.body.removeChild(overlay); resolve(true); });
      btnCancel.addEventListener('click', () => { document.body.removeChild(overlay); resolve(false); });
    });
  }
  if (!ok) return;
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

if (csvFileInput) {
  csvFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    parseCsvFile(file, ['name','contact','email','phone','notes'])
      .then(rows => {
        const imported = rows.map(row => ({
          id: Date.now().toString() + Math.random().toString(16).slice(2),
          name: row.name || '',
          contact: row.contact || '',
          email: row.email || '',
          phone: row.phone || '',
          notes: row.notes || ''
        })).filter(item => item.name && item.email);
        providers = providers.concat(imported);
        saveProviders();
        renderProviders();
      })
      .catch(err => {
        console.error(err);
        alert('Error al cargar el CSV: ' + err.message);
      })
      .finally(() => {
        csvFileInput.value = '';
      });
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
  // foco en el nombre para acelerar ingreso
  const nameEl = document.getElementById('providerName');
  if (nameEl) nameEl.focus();
});

renderProviders();

// Botón limpiar (si existe)
const resetProviderBtn = document.getElementById('resetProvider');
if (resetProviderBtn) {
  resetProviderBtn.addEventListener('click', function() {
    providerForm.reset();
    editingId = null;
    document.getElementById('providerId').value = '';
    const nameEl = document.getElementById('providerName');
    if (nameEl) nameEl.focus();
  });
}