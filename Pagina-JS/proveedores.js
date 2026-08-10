/**
 * proveedores.js — CRUD Avanzado de Proveedores con Edición Inline
 * Sistema Administrativo Web · Dali Medica
 */

// 1. Verificación de Seguridad (RBAC)
verificarSesion(['empleado', 'admin']);

// 2. Elementos del DOM
const providerForm = document.getElementById("providerForm");
const providerList = document.getElementById("providerList");
const inputId = document.getElementById("providerId");
const inputName = document.getElementById("providerName");
const inputContact = document.getElementById("providerContact");
const inputEmail = document.getElementById("providerEmail");
const inputPhone = document.getElementById("providerPhone");
const inputNotes = document.getElementById("providerNotes");
const searchInput = document.getElementById("searchProvider");
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

// 5. Renderizado de la Tabla y Paginación
function renderProviders() {
    if (!providerList) return;

    const todos = getData('proveedores');

    const filtrados = todos.filter(proveedor => {
        const query = currentSearch.toLowerCase();
        if (proveedor.id === pendingDeleteId) return false;

        return proveedor.name.toLowerCase().includes(query) || 
               proveedor.contact.toLowerCase().includes(query) ||
               proveedor.email.toLowerCase().includes(query);
    });

    const totalPages = Math.ceil(filtrados.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const proveedoresPagina = filtrados.slice(startIndex, endIndex);

    providerList.innerHTML = "";
    proveedoresPagina.forEach((proveedor) => {
        const row = document.createElement("tr");
        row.dataset.id = proveedor.id;

        if (editingRowId === proveedor.id) {
            row.innerHTML = `
                <td><input type="text" id="edit-name-${proveedor.id}" value="${escapeHtml(proveedor.name)}" style="width:100%;padding:4px;"></td>
                <td><input type="text" id="edit-contact-${proveedor.id}" value="${escapeHtml(proveedor.contact)}" style="width:100%;padding:4px;"></td>
                <td><input type="email" id="edit-email-${proveedor.id}" value="${escapeHtml(proveedor.email)}" style="width:100%;padding:4px;"></td>
                <td><input type="text" id="edit-phone-${proveedor.id}" value="${escapeHtml(proveedor.phone)}" style="width:100%;padding:4px;"></td>
                <td><textarea id="edit-notes-${proveedor.id}" rows="2" style="width:100%;padding:4px;">${escapeHtml(proveedor.notes)}</textarea></td>
                <td class="actions">
                    <button type="button" class="secondary" onclick="saveInlineEdit('${proveedor.id}')">Guardar</button>
                    <button type="button" class="remove-btn" onclick="cancelInlineEdit()">Cancelar</button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${proveedor.name}</td>
                <td>${proveedor.contact}</td>
                <td>${proveedor.email}</td>
                <td>${proveedor.phone}</td>
                <td>${proveedor.notes}</td>
                <td class="actions">
                    <button type="button" class="secondary" onclick="startInlineEdit('${proveedor.id}')">Editar</button>
                    <button type="button" class="remove-btn" onclick="requestDeleteProvider('${proveedor.id}')">Eliminar</button>
                </td>
            `;
        }
        providerList.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (!paginationControls) return;
    paginationControls.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1 || editingRowId !== null;
    prevBtn.onclick = () => { currentPage--; renderProviders(); };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages || editingRowId !== null;
    nextBtn.onclick = () => { currentPage++; renderProviders(); };

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
        renderProviders();
    }, 300));
}

// 7. EDICIÓN INLINE
function startInlineEdit(id) {
    editingRowId = id;
    renderProviders();
    setTimeout(() => {
        const input = document.getElementById(`edit-name-${id}`);
        if (input) input.focus();
    }, 10);
}

function cancelInlineEdit() {
    editingRowId = null;
    renderProviders();
}

function saveInlineEdit(id) {
    const name = document.getElementById(`edit-name-${id}`).value.trim();
    const contact = document.getElementById(`edit-contact-${id}`).value.trim();
    const email = document.getElementById(`edit-email-${id}`).value.trim();
    const phone = document.getElementById(`edit-phone-${id}`).value.trim();
    const notes = document.getElementById(`edit-notes-${id}`).value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Error: Por favor ingresa un correo válido.");
        return;
    }

    const phoneRegex = /^[0-9+\-()\s]+$/;
    if (!phoneRegex.test(phone)) {
        alert("Error: El teléfono solo puede contener números, espacios, paréntesis y guiones.");
        return;
    }

    updateItem('proveedores', id, { name, contact, email, phone, notes });
    editingRowId = null;
    renderProviders();
}


// Variable global para tracking del toast activo
let activeToast = null;

// 8. Eliminación con Deshacer (Undo) - CORREGIDO
function requestDeleteProvider(id) {
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
    renderProviders();

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
        <span>Proveedor eliminado temporalmente.</span>
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
        renderProviders();
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
        deleteItem('proveedors', pendingDeleteId);
        pendingDeleteId = null;
    }
}


// 9. Guardado desde el Formulario (Crear nuevo)
if (providerForm) {
    providerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = inputEmail.value.trim();
        const phone = inputPhone.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Error: Por favor ingresa un correo válido.");
            return;
        }

        const phoneRegex = /^[0-9+\-()\s]+$/;
        if (!phoneRegex.test(phone)) {
            alert("Error: El teléfono solo puede contener números, espacios, paréntesis y guiones.");
            return;
        }

        const proveedorData = {
            name: inputName.value.trim(),
            contact: inputContact.value.trim(),
            email: email,
            phone: phone,
            notes: inputNotes.value.trim(),
        };

        addItem('proveedores', proveedorData);

        providerForm.reset();
        inputId.value = "";
        renderProviders();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProviders();
});