/**
 * productos.js — CRUD de Productos
 * Sistema Administrativo Web · Dali Medica
 */

verificarSesion(['admin', 'empleado']);

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchProduct');
const paginationControls = document.getElementById('paginationControls');

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
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.type}</td>
      <td>${formatPrice(product.price)}</td>
      <td>${product.prescription === 'si' ? 'Sí' : 'No'}</td>
      <td>${product.description || ''}</td>
      <td class="actions">
        <button onclick="editProduct('${product.id || index}')">Editar</button>
        <button onclick="deleteProduct('${product.id || index}')">Eliminar</button>
      </td>
    `;
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
  const index = products.findIndex(p => p.id === id || String(p.id) === String(id));
  if (index === -1) return;
  const product = products[index];
  editingId = id;
  document.getElementById('productId').value = id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productType').value = product.type;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productRequiresPrescription').value = product.prescription;
  document.getElementById('productDescription').value = product.description || '';
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;
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