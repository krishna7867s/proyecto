/**
 * clientes.js — CRUD de Clientes
 * Sistema Administrativo Web · Dali Medica
 *
 * Requiere que la página ya haya cargado js/auth.js (para verificarSesion()).
 * Guarda los clientes en LocalStorage bajo la clave "dali_clients".
 *
 * Este archivo espera encontrar en el HTML:
 *   <form id="clientForm">
 *     <input type="hidden" id="clientId">
 *     <input id="clientName">
 *     <input id="clientEmail">
 *     <input id="clientPhone">
 *     <textarea id="clientNotes"></textarea>
 *     <button type="submit">...</button>
 *   </form>
 *   <table>
 *     <tbody id="clientList"></tbody>
 *   </table>
 */

verificarSesion();

const clientForm = document.getElementById("clientForm");
const clientList = document.getElementById("clientList");

let clients = JSON.parse(localStorage.getItem("dali_clients") || "[]");
let editingId = null;

function saveClients() {
  localStorage.setItem("dali_clients", JSON.stringify(clients));
}

function renderClients() {
  clientList.innerHTML = "";
  clients.forEach((client, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>${client.notes}</td>
      <td class="actions">
        <button type="button" onclick="editClient(${index})">Editar</button>
        <button type="button" onclick="deleteClient(${index})">Eliminar</button>
      </td>
    `;
    clientList.appendChild(row);
  });
}

function editClient(index) {
  const client = clients[index];
  editingId = index;
  document.getElementById("clientId").value = index;
  document.getElementById("clientName").value = client.name;
  
  document.getElementById("clientEmail").value = client.email;
  document.getElementById("clientPhone").value = client.phone;
  document.getElementById("clientNotes").value = client.notes;
}

function deleteClient(index) {
  clients.splice(index, 1);
  saveClients();
  renderClients();
}

clientForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const client = {
    name: document.getElementById("clientName").value.trim(),
    email: document.getElementById("clientEmail").value.trim(),
    phone: document.getElementById("clientPhone").value.trim(),
    notes: document.getElementById("clientNotes").value.trim(),
  };
  if (editingId !== null) {
    clients[editingId] = client;
  } else {
    clients.push(client);
  }
  saveClients();
  renderClients();
  clientForm.reset();
  editingId = null;
});

renderClients();