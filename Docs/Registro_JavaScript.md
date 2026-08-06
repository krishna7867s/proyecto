# Registro de JavaScript — Dali Medica

## Resumen
Documentación del desarrollo en JavaScript para el Sistema Administrativo Web
de Dali Medica: autenticación, sesión y CRUD de Clientes. Todo el código vive
en la carpeta Pagina-JS/, separada del HTML (a cargo de mis compañeras).

## Decisión de arquitectura: sin storage.js
Se descartó el storage.js genérico (prefijo dm_) planificado al inicio, porque
el resto del equipo ya había avanzado usando LocalStorage directo con el
prefijo "dali_" (dali_user, dali_products, dali_providers, dali_cart). Para
mantener consistencia en todo el proyecto, auth.js y clientes.js usan
localStorage.getItem/setItem directo, con el prefijo "dali_" en sus claves.

## Archivos

### Pagina-JS/auth.js
Módulo de autenticación, registro y manejo de sesión.

**Claves de LocalStorage:**
- `dali_usuarios` — lista de usuarios válidos para login (usuario, password, nombre, rol)
- `dali_sesion` — sesión activa del usuario logueado

**Funciones:**
- `inicializarUsuarios()` — crea usuarios de prueba (admin/admin123, operador/operador123) la primera vez que corre el sistema.
- `iniciarSesion(usuario, password)` — valida credenciales contra dali_usuarios; guarda la sesión en dali_sesion si son correctas.
- `cerrarSesion()` — borra dali_sesion y redirige a login.html.
- `obtenerSesion()` — devuelve la sesión activa o null.
- `verificarSesion()` — protege páginas privadas; redirige a login.html si no hay sesión activa.
- `mostrarInfoUsuario()` — muestra el nombre del usuario logueado en el elemento con id="nombreUsuario" del header.
- `inicializarRegistro()` — se conecta al formulario id="signup" de crear_usuario.html; registra un usuario nuevo en dali_usuarios (evita duplicados) y redirige a login.html.

**Conexión automática a formularios:**
- Si la página tiene un `<form id="formLogin">`, auth.js maneja el submit y llama a iniciarSesion().
- inicializarRegistro() se llama manualmente desde crear_usuario.html.

### Pagina-JS/clientes.js
CRUD completo de Clientes, mismo patrón que usaron mis compañeras para
Productos y Proveedores (localStorage directo, sin storage.js).

**Clave de LocalStorage:** `dali_clients`

**Funciones:**
- `saveClients()` — guarda el arreglo completo de clientes.
- `renderClients()` — pinta la tabla de clientes en el DOM.
- `editClient(index)` — carga un cliente existente en el formulario para editarlo.
- `deleteClient(index)` — elimina un cliente por su posición en el arreglo.
- Listener de submit en `#clientForm` — crea o actualiza un cliente (según si hay editingId).

**Campos del cliente:** name, email, phone, notes.

Llama a `verificarSesion()` automáticamente al cargar (protege clientes.html).

## Corrección de bug: prefijo dm_ vs dali_
La primera versión de auth.js usaba el prefijo "dm_" (dm_usuarios, dm_sesion),
heredado del plan original con storage.js. Se corrigió a "dali_" para ser
consistente con el resto del proyecto, ya mergeado por mis compañeras.

## Bugs encontrados y corregidos durante integración
- Auth.js estaba nombrado con mayúscula inicial; se renombró a auth.js
  (minúscula) porque GitHub distingue mayúsculas/minúsculas en rutas,
  a diferencia de Windows — con el nombre original el script no habría
  cargado al desplegar.
- crear_usuario.html llamaba a una función inicializarRegistro() que no
  existía todavía en auth.js; se agregó esa función completa.
- Rutas de <script src="js/storage.js"> quedaron referenciadas en varios
  HTML aunque ese archivo nunca se creó; se coordinó con el equipo para
  quitarlas.
- Rutas relativas de auth.js mal calculadas en login.html y
  crear_usuario.html (pagina publica/) — usaban un solo "../" en vez de
  "../../" para llegar a Pagina-JS/ desde la raíz del proyecto.

## Flujo de login implementado
crear_usuario.html (registro) → guarda usuario en dali_usuarios → redirige
a login.html → login.html valida contra dali_usuarios → guarda dali_sesion
→ redirige a dashboard.html → dashboard.html y todas las páginas privadas
llaman verificarSesion() al cargar.

## Pendientes
- Probar el flujo completo de punta a punta (registro → login → CRUD →
  logout) una vez aplicada la última corrección de rutas.
- Confirmar si horarios.html y administrar.html (fuera del alcance mínimo
  del enunciado) llevan lógica JS o quedan como placeholder.

## Historial de cambios
- Creado auth.js (prefijo dm_ inicial) con login y verificación de sesión.
- Corregido auth.js: prefijo dm_ → dali_ para consistencia con el equipo.
- Agregada función inicializarRegistro() a auth.js.
- Renombrado Auth.js → auth.js (compatibilidad con GitHub, case-sensitive).
- Creado clientes.js con CRUD completo de Clientes.
- Coordinadas correcciones de rutas de scripts en el HTML del equipo.