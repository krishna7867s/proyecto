/**
 * productos.js — CRUD Avanzado de Productos con Edición Inline
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
let editingRowId = null;

// 4. Utilidad: Debounce
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatPrice(amount) {
    return '₡' + Number(amount).toLocaleString('es-CR');
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
        row.dataset.id = producto.id;

        if (editingRowId === producto.id) {
            row.innerHTML = `
                <td><input type="text" id="edit-name-${producto.id}" value="${escapeHtml(producto.name)}" style="width:100%;padding:4px;"></td>
                <td>
                    <select id="edit-type-${producto.id}" style="width:100%;padding:4px;">
                        <option value="Prótesis" ${producto.type === 'Prótesis' ? 'selected' : ''}>Prótesis</option>
                        <option value="Medicamento" ${producto.type === 'Medicamento' ? 'selected' : ''}>Medicamento</option>
                        <option value="Insumo" ${producto.type === 'Insumo' ? 'selected' : ''}>Insumo</option>
                        <option value="Equipo" ${producto.type === 'Equipo' ? 'selected' : ''}>Equipo</option>
                    </select>
                </td>
                <td><input type="number" id="edit-price-${producto.id}" value="${producto.price}" style="width:100%;padding:4px;"></td>
                <td>
                    <select id="edit-prescription-${producto.id}" style="width:100%;padding:4px;">
                        <option value="no" ${producto.prescription === 'no' ? 'selected' : ''}>No</option>
                        <option value="si" ${producto.prescription === 'si' ? 'selected' : ''}>Sí</option>
                    </select>
                </td>
                <td><textarea id="edit-description-${producto.id}" rows="2" style="width:100%;padding:4px;">${escapeHtml(producto.description)}</textarea></td>
                <td class="actions">
                    <button type="button" class="secondary" onclick="saveInlineEdit('${producto.id}')">Guardar</button>
                    <button type="button" class="remove-btn" onclick="cancelInlineEdit()">Cancelar</button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${producto.name}</td>
                <td>${producto.type}</td>
                <td>${formatPrice(producto.price)}</td>
                <td>${producto.prescription === 'si' ? 'Sí' : 'No'}</td>
                <td>${producto.description}</td>
                <td class="actions">
                    <button type="button" class="secondary" onclick="startInlineEdit('${producto.id}')">Editar</button>
                    <button type="button" class="remove-btn" onclick="requestDeleteProduct('${producto.id}')">Eliminar</button>
                </td>
            `;
        }
        productList.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (!paginationControls) return;
    paginationControls.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1 || editingRowId !== null;
    prevBtn.onclick = () => { currentPage--; renderProducts(); };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages || editingRowId !== null;
    nextBtn.onclick = () => { currentPage++; renderProducts(); };

    const spanInfo = document.createElement("span");
    spanInfo.textContent = ` Página ${currentPage} de ${totalPages} `;
    spanInfo.style.margin = "0 10px";

    paginationControls.appendChild(prevBtn);
    paginationControls.appendChild(spanInfo);
    paginationControls.appendChild(nextBtn);
}

// 6. Buscador con Debounce
if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
        if (editingRowId) return;
        currentSearch = e.target.value;
        currentPage = 1;
        renderProducts();
    }, 300));
}

// 7. EDICIÓN INLINE
function startInlineEdit(id) {
    editingRowId = id;
    renderProducts();
    setTimeout(() => {
        const input = document.getElementById(`edit-name-${id}`);
        if (input) input.focus();
    }, 10);
}

function cancelInlineEdit() {
    editingRowId = null;
    renderProducts();
}

function saveInlineEdit(id) {
    const name = document.getElementById(`edit-name-${id}`).value.trim();
    const type = document.getElementById(`edit-type-${id}`).value;
    const price = Number(document.getElementById(`edit-price-${id}`).value);
    const prescription = document.getElementById(`edit-prescription-${id}`).value;
    const description = document.getElementById(`edit-description-${id}`).value.trim();

    if (name.length < 2) {
        alert("Error: El nombre del producto debe tener al menos 2 caracteres.");
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert("Error: El precio debe ser un número mayor a 0.");
        return;
    }

    updateItem('productos', id, { name, type, price, prescription, description });
    editingRowId = null;
    renderProducts();
}


// Variable global para tracking del toast activo
let activeToast = null;

// 8. Eliminación con Deshacer (Undo) - CORREGIDO
function requestDeleteProduct(id) {
    if (editingRowId) return;

    // Si ya hay un toast activo, confirmar ese borrado primero
    if (pendingDeleteId) {
        commitDelete();
        clearTimeout(undoTimeout);
        if (activeToast && document.body.contains(activeToast)) {
            document.body.removeChild(activeToast);
        }
    }

    pendingDeleteId = id;
    renderProducts();

    // Crear nuevo toast
    const toast = document.createElement("div");
    activeToast = toast;
    toast.className = "undo-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "white";
    toast.style.padding = "15px 20px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "12px";

    toast.innerHTML = `
        <span>Producto eliminado temporalmente.</span>
        <button class="undo-btn" style="color: #ffeb3b; background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: bold; padding: 4px 8px;">
            Deshacer
        </button>
    `;

    document.body.appendChild(toast);

    // Adjuntar evento al botón específico de ESTE toast
    const undoBtn = toast.querySelector(".undo-btn");
    undoBtn.addEventListener("click", function() {
        clearTimeout(undoTimeout);
        pendingDeleteId = null;
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
        activeToast = null;
        renderProducts();
    });

    // Temporizador de 5 segundos
    undoTimeout = setTimeout(() => {
        commitDelete();
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
        activeToast = null;
    }, 5000);
}

function commitDelete() {
    if (pendingDeleteId) {
        deleteItem('productos', pendingDeleteId);
        pendingDeleteId = null;
    }
}


// 9. Guardado desde el Formulario (Crear nuevo)
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

        addItem('productos', productoData);

        productForm.reset();
        inputId.value = "";
        renderProducts();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});