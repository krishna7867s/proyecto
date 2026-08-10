/**
 * clientes.js — CRUD de Clientes
 * Sistema Administrativo Web · Dali Medica
 *
 * NOTA: Requiere que storage.js y Auth.js estén cargados ANTES que este archivo.
 */

// 1. Verificación de Seguridad (RBAC)
// Solo Empleados y Administradores pueden gestionar clientes.
// Si un cliente intenta entrar, será redirigido.
verificarSesion(['empleado', 'admin']);

// 2. Elementos del DOM
const clientForm = document.getElementById("clientForm");
const clientList = document.getElementById("clientList");
const inputId = document.getElementById("clientId");
const inputName = document.getElementById("clientName");
const inputEmail = document.getElementById("clientEmail");
const inputPhone = document.getElementById("clientPhone");
const inputNotes = document.getElementById("clientNotes");

// 3. Renderizado de la Tabla (Read)
function renderClients() {
  if (!clientList) return;
  
  // Limpiamos la tabla
  clientList.innerHTML = "";
  
  // Obtenemos los clientes usando nuestro motor storage.js
  const clientes = getData('clientes');
  
  // Dibujamos cada cliente en la tabla
  clientes.forEach((cliente) => {
    const row = document.createElement("tr");
    
    // Inyectamos el HTML. Nota cómo pasamos el cliente.id (string autogenerado) a las funciones
    row.innerHTML = `
      <td>${cliente.name}</td>
      <td>${cliente.email}</td>
      <td>${cliente.phone}</td>
      <td>${cliente.notes}</td>
      <td class="actions">
        <!-- Usamos las clases que extrajimos anteriormente para tu compañero de CSS -->
        <button type="button" class="secondary" onclick="editClient('${cliente.id}')">Editar</button>
        <button type="button" class="remove-btn" onclick="deleteClient('${cliente.id}')">Eliminar</button>
      </td>
    `;
    clientList.appendChild(row);
  });
}

// 4. Lógica de Edición (Update - Preparar formulario)
function editClient(id) {
  // Buscamos el cliente específico por su ID único
  const cliente = getItemById('clientes', id);
  if (!cliente) return;
  
  // Llenamos el formulario con los datos encontrados
  inputId.value = cliente.id; // Guardamos el ID oculto para saber que estamos editando
  inputName.value = cliente.name;
  inputEmail.value = cliente.email;
  inputPhone.value = cliente.phone;
  inputNotes.value = cliente.notes;
}

// 5. Lógica de Eliminación (Delete)
function deleteClient(id) {
  // Confirmación básica antes de borrar (Buena práctica de UI)
  if(confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    deleteItem('clientes', id);
    renderClients(); // Refrescamos la tabla inmediatamente
  }
}

// 6. Lógica de Guardado (Create & Update final)
if(clientForm) {
    clientForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      // Construimos el objeto cliente con los datos del formulario
      const clienteData = {
        name: inputName.value.trim(),
        email: inputEmail.value.trim(),
        phone: inputPhone.value.trim(),
        notes: inputNotes.value.trim(),
      };
      
      const currentId = inputId.value;
      
      if (currentId) {
        // Si hay un ID en el input oculto, significa que estamos EDITANDO
        updateItem('clientes', currentId, clienteData);
      } else {
        // Si no hay ID, es un cliente NUEVO
        addItem('clientes', clienteData);
      }
      
      // Limpiamos el formulario y refrescamos la tabla
      clientForm.reset();
      inputId.value = ""; // Limpiamos el ID oculto
      renderClients();
    });
}

// 7. Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderClients();
});