/**
 * auth.js — Módulo de autenticación y manejo de sesión
 * Sistema Administrativo Web · Dali Medica
 *
 * Usa el prefijo "dali_" para ser consistente con las claves ya usadas
 * en el proyecto (dali_user, dali_products, dali_providers, dali_cart).
 *
 * Claves de LocalStorage que maneja este archivo:
 *   dali_usuarios -> lista de usuarios válidos para hacer login
 *   dali_sesion   -> sesión activa (quién está logueado ahora)
 *
 * Nota: dali_user (singular, sin "s") es la que usa crear_usuario.html
 * para el registro rápido. dali_sesion es la nueva clave para el login
 * real con validación de usuario/contraseña que pide el enunciado.
 */

// ---------------------------------------------------------
// 1. Configuración y usuarios semilla
// ---------------------------------------------------------

const SESION_KEY = "dali_sesion";
const USUARIOS_KEY = "dali_usuarios";

// Usuarios de prueba: se crean solo la primera vez que corre el sistema
const USUARIOS_SEMILLA = [
  { usuario: "admin", email: "admin@dalimedica.cr", password: "admin123", nombre: "Administrador", rol: "admin" },
  { usuario: "operador", email: "operador@dalimedica.cr", password: "operador123", nombre: "Operador", rol: "operador" },
];

/**
 * Crea los usuarios semilla en LocalStorage si aún no existen.
 * Llamar una sola vez al cargar login.html.
 */
function inicializarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || "null");
  if (!usuarios || usuarios.length === 0) {
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(USUARIOS_SEMILLA));
  }
}

// ---------------------------------------------------------
// 2. Login
// ---------------------------------------------------------

/**
 * Valida credenciales contra los usuarios guardados.
 * @param {string} usuario
 * @param {string} password
 * @returns {{ok: boolean, mensaje?: string}}
 */
function iniciarSesion(usuario, password) {
  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || "[]");

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

  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
  return { ok: true };
}

/**
 * Cierra la sesión activa y redirige al login.
 */
function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
  // Se llama desde pagina privada/ → login está un nivel arriba en pagina publica/
  window.location.href = "../pagina publica/login.html";
}

// ---------------------------------------------------------
// 3. Verificación de sesión (usar en dashboard, clientes, productos-admin, proveedores)
// ---------------------------------------------------------

/**
 * Devuelve el objeto de sesión activa, o null si no hay sesión.
 */
function obtenerSesion() {
  const data = localStorage.getItem(SESION_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Protege una página: si no hay sesión activa, redirige al login.
 * Llamar al inicio de cada página privada.
 */
function verificarSesion() {
  const sesion = obtenerSesion();
  if (!sesion) {
    // Se llama desde pagina privada/ → login está un nivel arriba en pagina publica/
    window.location.href = "../pagina publica/login.html";
    return null;
  }
  return sesion;
}

/**
 * Pinta el nombre del usuario logueado en cualquier elemento del header
 * que tenga el id "nombreUsuario".
 */
function mostrarInfoUsuario() {
  const sesion = obtenerSesion();
  const contenedor = document.getElementById("nombreUsuario");
  if (sesion && contenedor) {
    contenedor.textContent = sesion.nombre;
  }
}

// ---------------------------------------------------------
// 4. Manejo del formulario de login (solo aplica en login.html)
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  inicializarUsuarios();

  const formLogin = document.getElementById("formLogin");
  if (!formLogin) return; // no estamos en login.html, no hacer nada más

  const inputUsuario = document.getElementById("usuario");
  const inputPassword = document.getElementById("password");
  const mensajeError = document.getElementById("mensajeError");

  formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultado = iniciarSesion(inputUsuario.value, inputPassword.value);

    if (resultado.ok) {
      // login.html está en pagina publica/ → dashboard está en pagina privada/
      window.location.href = "../pagina privada/dashboard.html";
    } else {
      mensajeError.textContent = resultado.mensaje;
      mensajeError.style.display = "block";
    }
  });
});

// ---------------------------------------------------------
// 5. Registro de usuarios nuevos (solo aplica en crear_usuario.html)
// ---------------------------------------------------------

/**
 * Registra un usuario nuevo en la lista dali_usuarios, para que después
 * pueda iniciar sesión desde login.html.
 * Se conecta automáticamente al formulario id="signup" de crear_usuario.html
 * (inputs id="email", id="password"; mensaje en id="msg").
 */
function inicializarRegistro() {
  inicializarUsuarios();

  const formSignup = document.getElementById("signup");
  if (!formSignup) return; // no estamos en crear_usuario.html, no hacer nada más

  const inputUsuario = document.getElementById("usuario");
  const inputPassword = document.getElementById("password");
  const mensaje = document.getElementById("msg");

  formSignup.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const identificador = inputUsuario.value.trim();
    const password = inputPassword.value;

    if (!identificador || !password) return;

    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || "[]");

    const yaExiste = usuarios.some(
      (u) => u.usuario === identificador || u.email === identificador
    );
    if (yaExiste) {
      mensaje.style.color = "#c00";
      mensaje.textContent = "Ese usuario o correo ya existe. Intenta iniciar sesión.";
      return;
    }

    usuarios.push({
      usuario: identificador,
      email: identificador.includes("@") ? identificador : "",
      password: password,
      nombre: identificador,
      rol: "cliente",
    });
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));

    mensaje.style.color = "green";
    mensaje.textContent = "Usuario creado. Redirigiendo al login...";
    setTimeout(() => {
      // crear_usuario.html está en pagina publica/ → login.html también está ahí
      window.location.href = "login.html";
    }, 800);
  });
}