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
  const existentes = new Map(usuarios.map(u => [String(u.usuario || '').trim().toLowerCase(), u]));
  let cambio = false;

  USUARIOS_SEMILLA.forEach((seed) => {
    const key = String(seed.usuario).trim().toLowerCase();
    if (!existentes.has(key)) {
      usuarios.push(seed);
      cambio = true;
    }
  });

  if (cambio || usuarios.length === 0) {
    saveData('usuarios', usuarios);
  }
}

/**
 * Migración para datos legacy usados por el login inline.
 * Algunas páginas usan las llaves `usuariosDaliMedica` y
 * `usuariosDaliMedicaSesion` en localStorage. Aquí las migramos
 * a las llaves estándar `usuarios` y `sesion` para compatibilidad.
 */
function migrarDatosLegacy() {
  try {
    const legacyUsers = localStorage.getItem('usuariosDaliMedica');
    if (legacyUsers) {
      const parsed = JSON.parse(legacyUsers);
      if (Array.isArray(parsed) && parsed.length > 0) {
        saveData('usuarios', parsed);
      }
      localStorage.removeItem('usuariosDaliMedica');
    }

    const legacySesion = localStorage.getItem('usuariosDaliMedicaSesion');
    if (legacySesion) {
      const ses = JSON.parse(legacySesion);
      if (ses && ses.usuario) {
        saveData('sesion', ses);
      }
      localStorage.removeItem('usuariosDaliMedicaSesion');
    }
  } catch (e) {
    console.warn('Error al migrar datos legacy:', e);
  }
}

// ---------------------------------------------------------
// 2. Login
// ---------------------------------------------------------

// Helpers para resolver rutas relativas evitando usar rutas absolutas
function resolvePublic(subpath) {
  const p = window.location.pathname;
  if (p.includes('/pagina privada/') || p.includes('/pagina%20privada/')) {
    return '../pagina publica/' + subpath;
  }
  if (p.includes('/pagina publica/') || p.includes('/pagina%20publica/')) {
    return subpath;
  }
  return 'Pagina-html/pagina publica/' + subpath;
}

function resolvePrivate(subpath) {
  const p = window.location.pathname;
  if (p.includes('/pagina privada/') || p.includes('/pagina%20privada/')) {
    return subpath;
  }
  if (p.includes('/pagina publica/') || p.includes('/pagina%20publica/')) {
    return '../pagina privada/' + subpath;
  }
  return 'Pagina-html/pagina privada/' + subpath;
}

// Small inline modal fallback in case global showConfirm/showAlert
function modalConfirm(message) {
  if (typeof showConfirm === 'function') return showConfirm(message);
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;inset:0;background:rgba(2,6,23,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;';
    const box = document.createElement('div');
    box.style = 'max-width:480px;padding:18px;border-radius:12px;background:#071226;color:#fff;border:1px solid rgba(255,255,255,0.04);';
    const msg = document.createElement('div'); msg.style.marginBottom = '12px'; msg.textContent = message;
    const actions = document.createElement('div'); actions.style.display = 'flex'; actions.style.justifyContent = 'flex-end'; actions.style.gap='8px';
    const btnCancel = document.createElement('button'); btnCancel.textContent = 'Cancelar'; btnCancel.style.padding='8px 12px';
    const btnOk = document.createElement('button'); btnOk.textContent = 'Aceptar'; btnOk.style.padding='8px 12px'; btnOk.style.background='#00b4ff'; btnOk.style.border='none'; btnOk.style.color='#021020';
    actions.appendChild(btnCancel); actions.appendChild(btnOk);
    box.appendChild(msg); box.appendChild(actions); overlay.appendChild(box); document.body.appendChild(overlay);
    btnOk.addEventListener('click', () => { document.body.removeChild(overlay); resolve(true); });
    btnCancel.addEventListener('click', () => { document.body.removeChild(overlay); resolve(false); });
  });
}

function modalAlert(message) {
  if (typeof showAlert === 'function') return showAlert(message);
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;inset:0;background:rgba(2,6,23,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;';
    const box = document.createElement('div');
    box.style = 'max-width:480px;padding:18px;border-radius:12px;background:#071226;color:#fff;border:1px solid rgba(255,255,255,0.04);';
    const msg = document.createElement('div'); msg.style.marginBottom = '12px'; msg.textContent = message;
    const actions = document.createElement('div'); actions.style.display = 'flex'; actions.style.justifyContent = 'flex-end';
    const btnOk = document.createElement('button'); btnOk.textContent = 'Aceptar'; btnOk.style.padding='8px 12px'; btnOk.style.background='#00b4ff'; btnOk.style.border='none'; btnOk.style.color='#021020';
    actions.appendChild(btnOk);
    box.appendChild(msg); box.appendChild(actions); overlay.appendChild(box); document.body.appendChild(overlay);
    btnOk.addEventListener('click', () => { document.body.removeChild(overlay); resolve(); });
  });
}

/**
 * Valida credenciales contra los usuarios guardados.
 * @param {string} usuario
 * @param {string} password
 * @returns {{ok: boolean, mensaje?: string, rol?: string}}
 */
function iniciarSesion(usuario, password) {
  const usuarios = getData('usuarios');
  const credencial = String(usuario).trim().toLowerCase();
  const passwordText = String(password);
  
  const encontrado = usuarios.find((u) => {
    const usuarioGuardado = String(u.usuario || '').trim().toLowerCase();
    const emailGuardado = String(u.email || '').trim().toLowerCase();
    return (usuarioGuardado === credencial || emailGuardado === credencial) && u.password === passwordText;
  });

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
    window.location.href = resolvePublic('login.html');
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
    window.location.href = resolvePublic('login.html');
    return null;
  }

  // 2. Si hay roles especificados, verificar si el usuario tiene permiso
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(sesion.rol)) {
    const msg = "Acceso denegado: No tienes permisos para ver esta página.";
    modalAlert(msg).then(() => {
      if (sesion.rol === 'cliente') {
        window.location.href = resolvePublic('productos.html');
      } else {
        window.location.href = resolvePrivate('dashboard.html');
      }
    });
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

function esAdmin() {
  const sesion = obtenerSesion();
  return sesion && sesion.rol === 'admin';
}

function esEmpleado() {
  const sesion = obtenerSesion();
  return sesion && sesion.rol === 'empleado';
}

function esCliente() {
  const sesion = obtenerSesion();
  return sesion && sesion.rol === 'cliente';
}

// ---------------------------------------------------------
// 4. Manejo de Formularios Automático
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  migrarDatosLegacy();
  inicializarUsuarios();
  mostrarInfoUsuario();

  // --- Lógica de Login ---
  const formLogin = document.getElementById("formLogin") || document.getElementById("loginForm");
  if (formLogin) {
      const inputUsuario = document.getElementById("usuario");
      const inputPassword = document.getElementById("password");
      const mensajeError = document.getElementById("mensajeError") || document.getElementById("msg");

      formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const resultado = iniciarSesion(inputUsuario.value, inputPassword.value);

        if (resultado.ok) {
          if (resultado.rol === 'cliente') {
            window.location.href = resolvePublic('productos.html');
          } else {
            window.location.href = resolvePrivate('dashboard.html');
          }
        } else {
          if (mensajeError) {
            mensajeError.textContent = resultado.mensaje;
            mensajeError.style.display = "block";
          } else {
            modalAlert(resultado.mensaje);
          }
        }
      });
  }

  // --- Lógica de Registro (Signup) ---
  const formSignup = document.getElementById("signupForm") || document.getElementById("signup");
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
          if (mensaje) {
            mensaje.style.color = "#c00";
            mensaje.textContent = "Ese usuario o correo ya existe. Intenta iniciar sesión.";
          }
          return;
        }

        addItem('usuarios', {
          usuario: identificador,
          email: identificador.includes("@") ? identificador : "",
          password: password,
          nombre: identificador,
          rol: "cliente"
        });

        if (mensaje) {
          mensaje.style.color = "green";
          mensaje.textContent = "Usuario creado. Redirigiendo al login...";
        }
        setTimeout(() => {
          window.location.href = resolvePublic('login.html');
        }, 800);
      });
  }
});
