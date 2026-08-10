/**
 * clientes.js — CRUD Avanzado de Clientes con Edición Inline
 * Sistema Administrativo Web · Dali Medica
 */

// 1. Verificación de Seguridad (RBAC)
verificarSesion(['empleado', 'admin']);

// 2. Elementos del DOM
const clientForm = document.getElementById("clientForm");
const clientList = document.getElementById("clientList");
const inputId = document.getElementById("clientId");
const inputName = document.getElementById("clientName");
const inputEmail = document.getElementById("clientEmail");
const inputPhone = document.getElementById("clientPhone");
const inputNotes = document.getElementById("clientNotes");
const searchInput = document.getElementById("searchClient");
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
function renderClients() {
    if (!clientList) return;

    const todos = getData('clientes');

    const filtrados = todos.filter(cliente => {
        const query = currentSearch.toLowerCase();
        if (cliente.id === pendingDeleteId) return false;

        return cliente.name.toLowerCase().includes(query) || 
               cliente.email.toLowerCase().includes(query) ||
               cliente.phone.toLowerCase().includes(query);
    });

    const totalPages = Math.ceil(filtrados.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clientesPagina = filtrados.slice(startIndex, endIndex);

    clientList.innerHTML = "";
    clientesPagina.forEach((cliente) => {
        const row = document.createElement("tr");
        row.dataset.id = cliente.id;

        if (editingRowId === cliente.id) {
            row.innerHTML = `
                <td><input type="text" id="edit-name-${cliente.id}" value="${escapeHtml(cliente.name)}" style="width:100%;padding:4px;"></td>
                <td><input type="email" id="edit-email-${cliente.id}" value="${escapeHtml(cliente.email)}" style="width:100%;padding:4px;"></td>
                <td><input type="text" id="edit-phone-${cliente.id}" value="${escapeHtml(cliente.phone)}" style="width:100%;padding:4px;"></td>
                <td><textarea id="edit-notes-${cliente.id}" rows="2" style="width:100%;padding:4px;">${escapeHtml(cliente.notes)}</textarea></td>
                <td class="actions">
                    <button type="button" class="secondary" onclick="saveInlineEdit('${cliente.id}')">Guardar</button>
                    <button type="button" class="remove-btn" onclick="cancelInlineEdit()">Cancelar</button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${cliente.name}</td>
                <td>${cliente.email}</td>
                <td>${cliente.phone}</td>
                <td>${cliente.notes}</td>
                <td class="actions">
                    <button type="button" class="secondary" onclick="startInlineEdit('${cliente.id}')">Editar</button>
                    <button type="button" class="remove-btn" onclick="requestDeleteClient('${cliente.id}')">Eliminar</button>
                </td>
            `;
        }
        clientList.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (!paginationControls) return;
    paginationControls.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1 || editingRowId !== null;
    prevBtn.onclick = () => { currentPage--; renderClients(); };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages || editingRowId !== null;
    nextBtn.onclick = () => { currentPage++; renderClients(); };

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
        renderClients();
    }, 300));
}

// 7. EDICIÓN INLINE
function startInlineEdit(id) {
    editingRowId = id;
    renderClients();
    setTimeout(() => {
        const input = document.getElementById(`edit-name-${id}`);
        if (input) input.focus();
    }, 10);
}

function cancelInlineEdit() {
    editingRowId = null;
    renderClients();
}

function saveInlineEdit(id) {
    const name = document.getElementById(`edit-name-${id}`).value.trim();
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

    updateItem('clientes', id, { name, email, phone, notes });
    editingRowId = null;
    renderClients();
}


// Variable global para tracking del toast activo
let activeToast = null;

// 8. Eliminación con Deshacer (Undo) - CORREGIDO
function requestDeleteClient(id) {
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
    renderClients();

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
        <span>Cliente eliminado temporalmente.</span>
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
        renderClients();
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
        deleteItem('clientes', pendingDeleteId);
        pendingDeleteId = null;
    }
}


// 9. Guardado desde el Formulario (Crear nuevo)
if (clientForm) {
    clientForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = inputEmail.value.trim();
        const phone = inputPhone.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Error: Por favor ingresa un correo válido (ej. juan@gmail.com).");
            return;
        }

        const phoneRegex = /^[0-9+\-()\s]+$/;
        if (!phoneRegex.test(phone)) {
            alert("Error: El teléfono solo puede contener números, espacios, paréntesis y guiones.");
            return;
        }

        const clienteData = {
            name: inputName.value.trim(),
            email: email,
            phone: phone,
            notes: inputNotes.value.trim(),
        };

        addItem('clientes', clienteData);

        clientForm.reset();
        inputId.value = "";
        renderClients();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderClients();
});