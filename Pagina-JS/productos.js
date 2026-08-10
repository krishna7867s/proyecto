/**
 * productos.js — CRUD Avanzado de Productos
 * Sistema Administrativo Web · Dali Medica
 */

// 1. Verificación de Seguridad (RBAC)
verificarSesion(['empleado', 'admin']);

// 2. Elementos del DOM
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const inputId = document.getElementById("productId");
const inputName = document.getElementById("productName");
const inputType = document.getElementById("productType");
const inputPrice = document.getElementById("productPrice");
const inputPrescription = document.getElementById("productRequiresPrescription");
const inputDescription = document.getElementById("productDescription");
const searchInput = document.getElementById("searchProduct");
const paginationControls = document.getElementById("paginationControls");

// 3. Estado
let currentPage = 1;
const itemsPerPage = 10;
let currentSearch = "";
let pendingDeleteId = null;
let undoTimeout = null;

// 4. Utilidad: Debounce
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// 5. Renderizado de la Tabla y Paginación
function renderProducts() {
    if (!productList) return;

    const todos = getData('productos');

    const filtrados = todos.filter(producto => {
        const query = currentSearch.toLowerCase();
        if (producto.id === pendingDeleteId) return false;

        return producto.name.toLowerCase().includes(query) || 
               producto.type.toLowerCase().includes(query) ||
               producto.description.toLowerCase().includes(query);
    });

    const totalPages = Math.ceil(filtrados.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productosPagina = filtrados.slice(startIndex, endIndex);

    productList.innerHTML = "";
    productosPagina.forEach((producto) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.name}</td>
            <td>${producto.type}</td>
            <td>${formatPrice(producto.price)}</td>
            <td>${producto.prescription === 'si' ? 'Sí' : 'No'}</td>
            <td>${producto.description}</td>
            <td class="actions">
                <button type="button" class="secondary" onclick="editProduct('${producto.id}')">Editar</button>
                <button type="button" class="remove-btn" onclick="requestDeleteProduct('${producto.id}')">Eliminar</button>
            </td>
        `;
        productList.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (!paginationControls) return;
    paginationControls.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; renderProducts(); };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; renderProducts(); };

    const spanInfo = document.createElement("span");
    spanInfo.textContent = ` Página ${currentPage} de ${totalPages} `;
    spanInfo.style.margin = "0 10px";

    paginationControls.appendChild(prevBtn);
    paginationControls.appendChild(spanInfo);
    paginationControls.appendChild(nextBtn);
}

function formatPrice(amount) {
    return '₡' + Number(amount).toLocaleString('es-CR');
}

// 6. Buscador con Debounce
if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        renderProducts();
    }, 300));
}

// 7. Edición
function editProduct(id) {
    const producto = getItemById('productos', id);
    if (!producto) return;

    inputId.value = producto.id;
    inputName.value = producto.name;
    inputType.value = producto.type;
    inputPrice.value = producto.price;
    inputPrescription.value = producto.prescription;
    inputDescription.value = producto.description;
}

// 8. Eliminación con Deshacer (Undo)
function requestDeleteProduct(id) {
    if (pendingDeleteId) {
        commitDelete();
    }

    pendingDeleteId = id;
    renderProducts();

    const toast = document.createElement("div");
    toast.id = "undoToast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "white";
    toast.style.padding = "15px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

    toast.innerHTML = `
        Producto eliminado temporalmente. 
        <button id="undoBtn" style="margin-left: 10px; color: #ffeb3b; background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: bold;">
            Deshacer
        </button>
    `;
    document.body.appendChild(toast);

    document.getElementById("undoBtn").onclick = () => {
        clearTimeout(undoTimeout);
        pendingDeleteId = null;
        document.body.removeChild(toast);
        renderProducts();
    };

    undoTimeout = setTimeout(() => {
        commitDelete();
        if(document.body.contains(toast)) document.body.removeChild(toast);
    }, 5000);
}

function commitDelete() {
    if (pendingDeleteId) {
        deleteItem('productos', pendingDeleteId);
        pendingDeleteId = null;
    }
}

// 9. Validaciones Avanzadas y Guardado
if (productForm) {
    productForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = inputName.value.trim();
        const price = Number(inputPrice.value);

        if (name.length < 2) {
            alert("Error: El nombre del producto debe tener al menos 2 caracteres.");
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Error: El precio debe ser un número mayor a 0.");
            return;
        }

        const productoData = {
            name: name,
            type: inputType.value,
            price: price,
            prescription: inputPrescription.value,
            description: inputDescription.value.trim(),
        };

        const currentId = inputId.value;
        if (currentId) {
            updateItem('productos', currentId, productoData);
        } else {
            addItem('productos', productoData);
        }

        productForm.reset();
        inputId.value = "";
        renderProducts();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});
