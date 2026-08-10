/**
 * clientes.js — CRUD Avanzado de Clientes
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

// 3. Estado (Variables globales para Paginación y Búsqueda)
let currentPage = 1;
const itemsPerPage = 10;
let currentSearch = "";
let pendingDeleteId = null; // Para el Undo
let undoTimeout = null;

// 4. Utilidad: Debounce para la búsqueda
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// 5. Renderizado de la Tabla y Paginación (Read)
function renderClients() {
    if (!clientList) return;
    
    // Obtener todos los clientes
    const todos = getData('clientes');
    
    // Filtrar por búsqueda
    const filtrados = todos.filter(cliente => {
        const query = currentSearch.toLowerCase();
        // No mostrar el que está pendiente de eliminar (Undo visual)
        if (cliente.id === pendingDeleteId) return false;
        
        return cliente.name.toLowerCase().includes(query) || 
               cliente.email.toLowerCase().includes(query) ||
               cliente.phone.toLowerCase().includes(query);
    });

    // Paginación lógica
    const totalPages = Math.ceil(filtrados.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clientesPagina = filtrados.slice(startIndex, endIndex);

    // Dibujar Tabla
    clientList.innerHTML = "";
    clientesPagina.forEach((cliente) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cliente.name}</td>
            <td>${cliente.email}</td>
            <td>${cliente.phone}</td>
            <td>${cliente.notes}</td>
            <td class="actions">
                <button type="button" class="secondary" onclick="editClient('${cliente.id}')">Editar</button>
                <button type="button" class="remove-btn" onclick="requestDeleteClient('${cliente.id}')">Eliminar</button>
            </td>
        `;
        clientList.appendChild(row);
    });

    // Dibujar Controles de Paginación
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (!paginationControls) return;
    paginationControls.innerHTML = "";
    
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; renderClients(); };
    
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages;
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
        currentSearch = e.target.value;
        currentPage = 1; // Regresar a la primera página al buscar
        renderClients();
    }, 300));
}

// 7. Edición
function editClient(id) {
    const cliente = getItemById('clientes', id);
    if (!cliente) return;
    
    inputId.value = cliente.id;
    inputName.value = cliente.name;
    inputEmail.value = cliente.email;
    inputPhone.value = cliente.phone;
    inputNotes.value = cliente.notes;
}

// 8. Eliminación con Deshacer (Undo)
function requestDeleteClient(id) {
    // Si ya había uno en proceso, lo borramos de verdad para procesar el nuevo
    if (pendingDeleteId) {
        commitDelete();
    }
    
    pendingDeleteId = id;
    renderClients(); // Desaparece visualmente de la tabla
    
    // Crear Toast temporal
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
        Cliente eliminado temporalmente. 
        <button id="undoBtn" style="margin-left: 10px; color: #ffeb3b; background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: bold;">
            Deshacer
        </button>
    `;
    document.body.appendChild(toast);
    
    document.getElementById("undoBtn").onclick = () => {
        // Deshacer acción
        clearTimeout(undoTimeout);
        pendingDeleteId = null;
        document.body.removeChild(toast);
        renderClients(); // Vuelve a aparecer en la tabla
    };
    
    // Temporizador de 5 segundos para confirmar borrado definitivo
    undoTimeout = setTimeout(() => {
        commitDelete();
        if(document.body.contains(toast)) document.body.removeChild(toast);
    }, 5000);
}

function commitDelete() {
    if (pendingDeleteId) {
        deleteItem('clientes', pendingDeleteId);
        pendingDeleteId = null;
    }
}

// 9. Validaciones Avanzadas y Guardado
if (clientForm) {
    clientForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const email = inputEmail.value.trim();
        const phone = inputPhone.value.trim();
        
        // Validación Avanzada de Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Error: Por favor ingresa un correo válido (ej. juan@gmail.com).");
            return; // Detiene el guardado
        }
        
        const phoneRegex = /^[0-9+\-()\s]+$/;
        if (!phoneRegex.test(phone)) {
            alert("Error: El teléfono solo puede contener números, espacios, paréntesis y guiones.");
            return; // Detiene el guardado
        }

        const clienteData = {
            name: inputName.value.trim(),
            email: email,
            phone: phone,
            notes: inputNotes.value.trim(),
        };
        
        const currentId = inputId.value;
        if (currentId) {
            updateItem('clientes', currentId, clienteData);
        } else {
            addItem('clientes', clienteData);
        }
        
        clientForm.reset();
        inputId.value = "";
        renderClients();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderClients();
});