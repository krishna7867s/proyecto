/**
 * Auth.js — Módulo de autenticación, manejo de sesión y seguridad (RBAC)
 * Sistema Administrativo Web · Dali Medica
 *
 * NOTA IMPORTANTE: Este archivo depende de storage.js
 * Asegúrate de importar storage.js antes de Auth.js en tus HTML.
 */

// Usuarios de prueba: se crean solo la primera vez que corre el sistema
const USUARIOS_SEMILLA = [
  { usuario: "admin", email: "admin@dalimedica.cr", password: "admin123", nombre: "Administrador", rol: "admin" },
  { usuario: "operador", email: "operador@dalimedica.cr", password: "operador123", nombre: "Operador", rol: "empleado" },
];

/**
 * Crea los usuarios semilla si aún no existen.
 * Llamar una sola vez al cargar login.html.
 */
function inicializarUsuarios() {
  const usuarios = getData('usuarios');
  if (usuarios.length === 0) {
    saveData('usuarios', USUARIOS_SEMILLA);
  }
}

// ---------------------------------------------------------
// 2. Login
// ---------------------------------------------------------

/**
 * Valida credenciales contra los usuarios guardados.
 * @param {string} usuario
 * @param {string} password
 * @returns {{ok: boolean, mensaje?: string, rol?: string}}
 */
function iniciarSesion(usuario, password) {
  const usuarios = getData('usuarios');
  const credencial = usuario.trim();
  
  const encontrado = usuarios.find(
    (u) => (u.usuario === credencial || u.email === credencial) && u.password === password
  );

  if (!encontrado) {
    return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
  }

  const sesion = {
    usuario: encontrado.usuario,
    nombre: encontrado.nombre,
    rol: encontrado.rol,
    inicio: new Date().toISOString(),
  };

  // Guardamos la sesión activa usando storage.js
  saveData('sesion', sesion);
  
  // Plus: Guardamos un registro de asistencia si es un empleado/admin
  if(encontrado.rol === 'empleado' || encontrado.rol === 'admin') {
      addItem('asistencia', {
          usuario: encontrado.usuario,
          nombre: encontrado.nombre,
          rol: encontrado.rol,
          estado: 'Online',
          hora_entrada: new Date().toLocaleString()
      });
  }

  return { ok: true, rol: encontrado.rol };
}

/**
 * Cierra la sesión activa y redirige al login.
 */
function cerrarSesion() {
    const sesion = obtenerSesion();
    
    // Registrar salida si es empleado/admin
    if (sesion && (sesion.rol === 'empleado' || sesion.rol === 'admin')) {
        const asistencias = getData('asistencia');
        // Buscar el último registro Online de este usuario y ponerlo Offline
        const ultimaAsistencia = asistencias.slice().reverse().find(a => a.usuario === sesion.usuario && a.estado === 'Online');
        if(ultimaAsistencia) {
            ultimaAsistencia.estado = 'Offline';
            ultimaAsistencia.hora_salida = new Date().toLocaleString();
            updateItem('asistencia', ultimaAsistencia.id, ultimaAsistencia);
        }
    }
    
    // Eliminar sesión actual sobrescribiendo con nulo
    saveData('sesion', null);
    
    // Redirigir a login usando ruta absoluta desde la raíz del proyecto
    window.location.href = '/Pagina-html/pagina publica/login.html';
}

// ---------------------------------------------------------
// 3. Verificación de sesión (Control de Acceso por Roles - RBAC)
// ---------------------------------------------------------

/**
 * Devuelve el objeto de sesión activa, o null si no hay sesión.
 */
function obtenerSesion() {
  const data = getData('sesion');
  // getData devuelve [] si está vacío, verificamos si es un objeto con la propiedad usuario
  if (data && data.usuario) {
      return data;
  }
  return null;
}

/**
 * Protege una página: verifica si hay sesión y si el rol está permitido.
 * @param {Array} rolesPermitidos - Ej: ['admin', 'empleado']. Si está vacío, solo exige estar logueado.
 * @returns {Object|null} - Retorna la sesión o redirige y retorna null.
 */
function verificarSesion(rolesPermitidos = []) {
  const sesion = obtenerSesion();
  
  // 1. Si no hay sesión, lo devolvemos al login
  if (!sesion) {
    window.location.href = '/Pagina-html/pagina publica/login.html';
    return null;
  }

  // 2. Si hay roles especificados, verificar si el usuario tiene permiso
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(sesion.rol)) {
      alert("Acceso denegado: No tienes permisos para ver esta página.");
      // Redirigir a su lugar correspondiente
      if (sesion.rol === 'cliente') {
          window.location.href = '/Pagina-html/pagina publica/productos.html';
      } else {
          window.location.href = '/Pagina-html/pagina privada/dashboard.html';
      }
      return null;
  }

  return sesion;
}

/**
 * Pinta el nombre del usuario logueado en el header (id "nombreUsuario").
 */
function mostrarInfoUsuario() {
  const sesion = obtenerSesion();
  const contenedor = document.getElementById("nombreUsuario");
  if (sesion && contenedor) {
    contenedor.textContent = sesion.nombre;
  }
}

// ---------------------------------------------------------
// 4. Manejo de Formularios Automático
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Inicializamos usuarios siempre (para que admin y operador existan)
  inicializarUsuarios();
  
  // Mostrar el nombre del usuario si está en una página con ese elemento
  mostrarInfoUsuario();

  // --- Lógica de Login ---
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
      const inputUsuario = document.getElementById("usuario");
      const inputPassword = document.getElementById("password");
      const mensajeError = document.getElementById("mensajeError");

      formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const resultado = iniciarSesion(inputUsuario.value, inputPassword.value);

        if (resultado.ok) {
          // Redirección Inteligente basada en roles
          if (resultado.rol === 'cliente') {
              window.location.href = "/Pagina-html/pagina publica/productos.html";
          } else {
              window.location.href = "/Pagina-html/pagina privada/dashboard.html";
          }
        } else {
          mensajeError.textContent = resultado.mensaje;
          mensajeError.style.display = "block";
        }
      });
  }

  // --- Lógica de Registro (Signup) ---
  const formSignup = document.getElementById("signup");
  if (formSignup) {
      const inputUsuario = document.getElementById("usuario");
      const inputPassword = document.getElementById("password");
      const mensaje = document.getElementById("msg");

      formSignup.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const identificador = inputUsuario.value.trim();
        const password = inputPassword.value;

        if (!identificador || !password) return;

        const usuarios = getData('usuarios');
        const yaExiste = usuarios.some(u => u.usuario === identificador || u.email === identificador);
        
        if (yaExiste) {
          mensaje.style.color = "#c00";
          mensaje.textContent = "Ese usuario o correo ya existe. Intenta iniciar sesión.";
          return;
        }

        // Usamos addItem de storage.js que también genera un ID automático
        addItem('usuarios', {
          usuario: identificador,
          email: identificador.includes("@") ? identificador : "",
          password: password,
          nombre: identificador,
          rol: "cliente" // Todo auto-registro es cliente por defecto
        });

        mensaje.style.color = "green";
        mensaje.textContent = "Usuario creado. Redirigiendo al login...";
        setTimeout(() => {
          window.location.href = "/Pagina-html/pagina publica/login.html";
        }, 800);
      });
  }
});