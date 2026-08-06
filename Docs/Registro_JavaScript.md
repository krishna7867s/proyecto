# Registro de JavaScript — Dali Medica

## Resumen
Documentación del desarrollo en JavaScript para el Sistema Administrativo Web
de Dali Medica: módulo de almacenamiento genérico, autenticación y manejo de sesión.

## Archivos

### js/storage.js
Módulo genérico de acceso a LocalStorage, con prefijo `dm_` en todas las claves.

**Funciones:**
- `getData(coleccion)` — obtiene un arreglo desde LocalStorage (o `[]` si no existe).
- `saveData(coleccion, arreglo)` — guarda el arreglo completo.
- `addItem(coleccion, item)` — agrega un elemento nuevo.
- `updateItem(coleccion, id, cambios)` — actualiza un elemento existente.
- `deleteItem(coleccion, id)` — elimina un elemento por su id.
- `getItemById(coleccion, id)` — busca un elemento específico.

### js/auth.js
Módulo de autenticación y sesión, construido sobre `storage.js`.

**Funciones:**
- `inicializarUsuarios()` — crea usuarios de prueba la primera vez que corre el sistema.
- `iniciarSesion(usuario, password)` — valida credenciales contra los usuarios guardados.
- `cerrarSesion()` — borra la sesión activa y redirige al login.
- `obtenerSesion()` — devuelve la sesión activa o `null`.
- `verificarSesion()` — protege páginas privadas; redirige al login si no hay sesión.
- `mostrarInfoUsuario()` — muestra el nombre del usuario logueado en el header.

**Decisiones tomadas:**
- Se usa `dm_sesion` como clave separada (no un arreglo) porque solo existe una sesión activa a la vez.
- El login es contra una lista de usuarios en LocalStorage, no un usuario único — permite varios roles.

## Pendientes
- Definir campos exactos de Clientes, Productos y Proveedores.
- Conectar `login.html` con `auth.js` (ids: `formLogin`, `usuario`, `password`, `mensajeError`).
- Agregar `verificarSesion()` a las páginas privadas (dashboard, clientes, productos-admin, proveedores).
- CRUD de Clientes, Productos y Proveedores usando `storage.js`.

## Historial de cambios
- [fecha] Creado `storage.js` con funciones genéricas de LocalStorage.
- [fecha] Creado `auth.js` con login y verificación de sesión.