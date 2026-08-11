/**
 * productos.js — CRUD de Productos
 * Sistema Administrativo Web · Dali Medica
 */

verificarSesion(['admin']);

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchProduct');
const paginationControls = document.getElementById('paginationControls');
const csvFileInput = document.getElementById('csvFileInput');

let products = JSON.parse(localStorage.getItem('dali_products') || '[]');
let editingId = null;
let currentPage = 1;
const itemsPerPage = 10;
let currentSearch = '';

function saveProducts() {
  localStorage.setItem('dali_products', JSON.stringify(products));
}

function formatPrice(amount) {
  return '₡' + Number(amount).toLocaleString('es-CR');
}

function renderProducts() {
  const filtered = products.filter(p => {
    const query = currentSearch.toLowerCase();
    return p.name.toLowerCase().includes(query) ||
           p.type.toLowerCase().includes(query) ||
           p.description.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filtered.slice(start, end);

  productList.innerHTML = '';
  pageItems.forEach((product, index) => {
    const row = document.createElement('tr');
    const rowId = product.id || String(index);
    if (editingId && editingId === rowId) {
      row.innerHTML = `
        <td><input id="edit-product-name-${rowId}" type="text" value="${product.name}" style="width:100%;"></td>
        <td>
          <select id="edit-product-type-${rowId}" style="width:100%;">
            <option value="Prótesis" ${product.type === 'Prótesis' ? 'selected' : ''}>Prótesis</option>
            <option value="Medicamento" ${product.type === 'Medicamento' ? 'selected' : ''}>Medicamento</option>
            <option value="Insumo" ${product.type === 'Insumo' ? 'selected' : ''}>Insumo</option>
            <option value="Equipo" ${product.type === 'Equipo' ? 'selected' : ''}>Equipo</option>
          </select>
        </td>
        <td><input id="edit-product-price-${rowId}" type="number" value="${product.price}" style="width:100%;"></td>
        <td>
          <select id="edit-product-prescription-${rowId}" style="width:100%;">
            <option value="no" ${product.prescription !== 'si' ? 'selected' : ''}>No</option>
            <option value="si" ${product.prescription === 'si' ? 'selected' : ''}>Sí</option>
          </select>
        </td>
        <td><input id="edit-product-description-${rowId}" type="text" value="${product.description || ''}" style="width:100%;"></td>
        <td class="actions">
          <button type="button" onclick="saveInlineProduct('${rowId}')">Guardar</button>
          <button type="button" onclick="cancelInlineProduct()">Cancelar</button>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.type}</td>
        <td>${formatPrice(product.price)}</td>
        <td>${product.prescription === 'si' ? 'Sí' : 'No'}</td>
        <td>${product.description || ''}</td>
        <td class="actions">
          <button type="button" onclick="startInlineProduct('${rowId}')">Editar</button>
          <button type="button" onclick="deleteProduct('${rowId}')">Eliminar</button>
        </td>
      `;
    }
    productList.appendChild(row);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (!paginationControls) return;
  paginationControls.innerHTML = '';
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Anterior';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { currentPage--; renderProducts(); };
  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Siguiente';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { currentPage++; renderProducts(); };
  
  const spanInfo = document.createElement('span');
  spanInfo.textContent = ` Página ${currentPage} de ${totalPages} `;
  spanInfo.style.margin = '0 10px';

  paginationControls.appendChild(prevBtn);
  paginationControls.appendChild(spanInfo);
  paginationControls.appendChild(nextBtn);
}

function editProduct(id) {
  startInlineProduct(id);
}

function startInlineProduct(id) {
  editingId = id;
  renderProducts();
}

function cancelInlineProduct() {
  editingId = null;
  renderProducts();
}

function saveInlineProduct(id) {
  const name = document.getElementById(`edit-product-name-${id}`).value.trim();
  const type = document.getElementById(`edit-product-type-${id}`).value;
  const price = Number(document.getElementById(`edit-product-price-${id}`).value);
  const prescription = document.getElementById(`edit-product-prescription-${id}`).value;
  const description = document.getElementById(`edit-product-description-${id}`).value.trim();

  if (!name || !type) {
    alert('Nombre y tipo son obligatorios.');
    return;
  }

  const index = products.findIndex(p => p.id === id || String(p.id) === String(id));
  if (index === -1) return;

  products[index] = {
    ...products[index],
    name,
    type,
    price,
    prescription,
    description
  };

  saveProducts();
  editingId = null;
  renderProducts();
}

async function deleteProduct(id) {
  let ok = false;
  const message = '¿Eliminar este producto?';
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
  const index = products.findIndex(p => p.id === id || String(p.id) === String(id));
  if (index !== -1) {
    products.splice(index, 1);
    saveProducts();
    renderProducts();
  }
}

if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    currentSearch = e.target.value;
    currentPage = 1;
    renderProducts();
  });
}

if (csvFileInput) {
  csvFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    parseCsvFile(file, ['name','type','price','prescription','description'])
      .then(rows => {
        const imported = rows.map(row => ({
          id: Date.now().toString() + Math.random().toString(16).slice(2),
          name: row.name || '',
          type: row.type || '',
          price: Number(row.price) || 0,
          prescription: row.prescription ? row.prescription.toLowerCase() : 'no',
          description: row.description || ''
        })).filter(item => item.name && item.type);
        products = products.concat(imported);
        saveProducts();
        renderProducts();
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

productForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const product = {
    name: document.getElementById('productName').value.trim(),
    type: document.getElementById('productType').value,
    price: Number(document.getElementById('productPrice').value),
    prescription: document.getElementById('productRequiresPrescription').value,
    description: document.getElementById('productDescription').value.trim(),
  };

  if (editingId) {
    const index = products.findIndex(p => p.id === editingId || String(p.id) === String(editingId));
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
    }
  } else {
    product.id = Date.now().toString();
    products.push(product);
  }

  saveProducts();
  renderProducts();
  productForm.reset();
  editingId = null;
  document.getElementById('productId').value = '';
});

renderProducts();