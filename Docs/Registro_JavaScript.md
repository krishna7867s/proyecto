# Registro de JavaScript — Dali Medica

## Resumen

Documentación del desarrollo en JavaScript para el Sistema Administrativo Web de **Dali Medica**.

El código JavaScript se encarga de agregar la funcionalidad dinámica al sistema, incluyendo autenticación de usuarios, control de sesiones y permisos, almacenamiento de información, gestión de clientes, productos y proveedores, importación de archivos CSV, generación de datos de prueba, navegación dinámica y componentes de interfaz.

Todos los archivos JavaScript se encuentran dentro de la carpeta:

`proyecto/Pagina-JS/`

---

# Archivos JavaScript

## 1. `Auth.js`

Módulo encargado de la **autenticación, registro de usuarios, manejo de sesiones y control de acceso mediante roles (RBAC)**.

### Funcionalidades principales

* Creación automática de usuarios de prueba.
* Registro de nuevos usuarios.
* Inicio de sesión mediante usuario o correo electrónico.
* Cierre de sesión.
* Almacenamiento de la sesión activa.
* Verificación de sesión.
* Control de acceso según el rol del usuario.
* Registro de asistencia al iniciar sesión.
* Registro de salida al cerrar sesión.
* Migración de datos antiguos.
* Redirección automática entre páginas públicas y privadas.
* Mensajes de alerta y confirmación mediante modales.

### Usuarios de prueba

El sistema cuenta con usuarios iniciales para realizar pruebas:

* **Administrador**

  * Usuario: `admin`
  * Correo: `admin@dalimedica.cr`
  * Contraseña: `admin123`
  * Rol: `admin`

* **Empleado**

  * Usuario: `operador`
  * Correo: `operador@dalimedica.cr`
  * Contraseña: `operador123`
  * Rol: `empleado`

### Funciones principales

* `inicializarUsuarios()` — crea los usuarios iniciales si todavía no existen.
* `migrarDatosLegacy()` — convierte información almacenada con las claves antiguas al nuevo sistema.
* `iniciarSesion(usuario, password)` — verifica las credenciales del usuario.
* `cerrarSesion()` — finaliza la sesión y registra la hora de salida.
* `obtenerSesion()` — obtiene la sesión actualmente activa.
* `verificarSesion(rolesPermitidos)` — protege las páginas privadas y verifica permisos.
* `mostrarInfoUsuario()` — muestra información del usuario conectado.
* `inicializarRegistro()` — permite registrar nuevos usuarios.
* `resolvePublic()` — determina las rutas de las páginas públicas.
* `resolvePrivate()` — determina las rutas de las páginas privadas.
* `modalConfirm()` — muestra una ventana de confirmación.
* `modalAlert()` — muestra una ventana de alerta.

### Control de roles

El sistema utiliza diferentes roles para controlar el acceso:

* `admin`
* `empleado`
* `cliente`

Dependiendo del rol, el usuario puede acceder a diferentes funcionalidades del sistema.

---

# 2. `storage.js`

Archivo encargado de funcionar como un **motor de almacenamiento local**, centralizando las operaciones realizadas sobre `localStorage`.

Se utiliza el prefijo:

`dm_`

Esto permite mantener organizados los datos almacenados por el sistema.

### Funciones principales

* `getData(key)` — obtiene información almacenada.
* `saveData(key, data)` — guarda o sobrescribe información.
* `addItem(key, item)` — agrega un nuevo registro y genera un ID automáticamente.
* `updateItem(key, id, newData)` — modifica un registro existente.
* `deleteItem(key, id)` — elimina un registro.
* `getItemById(key, id)` — busca un registro mediante su ID.
* `parseCsvFile(file, columns)` — procesa archivos CSV y convierte sus filas en objetos JavaScript.

### Ejemplo de funcionamiento

Los datos se almacenan como arreglos de objetos dentro de `localStorage`.

Esto permite utilizar el navegador como una base de datos simulada para el proyecto sin necesidad de implementar un servidor o una base de datos externa.

---

# 3. `clientes.js`

Archivo encargado de administrar el **CRUD de clientes**.

CRUD significa:

* **Create** — crear.
* **Read** — consultar.
* **Update** — actualizar.
* **Delete** — eliminar.

La información de los clientes se almacena utilizando la clave:

`clientes`

### Datos administrados

Cada cliente puede contener:

* Nombre.
* Correo electrónico.
* Teléfono.
* Notas.
* ID.

### Funciones principales

* `renderClients()` — muestra los clientes en la tabla.
* `renderPagination(totalPages)` — genera los controles de paginación.
* `startInlineEdit(id)` — inicia la edición de un cliente directamente desde la tabla.
* `cancelInlineEdit()` — cancela la edición.
* `saveInlineEdit(id)` — guarda los cambios realizados.
* `requestDeleteClient(id)` — solicita confirmación antes de eliminar.
* `commitDelete()` — confirma la eliminación.
* `debounce(func, delay)` — controla la frecuencia de ejecución de la búsqueda.
* `escapeHtml(text)` — evita problemas al mostrar contenido introducido por usuarios.

### Búsqueda

Se implementó una búsqueda dinámica que permite encontrar clientes utilizando:

* Nombre.
* Correo.
* Teléfono.

### Paginación

La tabla muestra un máximo de **10 clientes por página**, permitiendo navegar entre diferentes páginas cuando existen más registros.

### Importación CSV

El sistema permite cargar clientes mediante un archivo CSV.

Los datos importados son convertidos a objetos JavaScript y posteriormente almacenados en `localStorage`.

### Validaciones

Se implementaron validaciones para:

* Correo electrónico.
* Número telefónico.
* Campos obligatorios.

También se utiliza una confirmación antes de eliminar registros.

---

# 4. `productos.js`

Archivo encargado de administrar los **productos médicos** del sistema.

Los productos se almacenan en:

`dali_products`

### Datos administrados

Cada producto contiene información como:

* Nombre.
* Tipo.
* Precio.
* Requiere receta.
* Descripción.
* ID.

### Funciones principales

* `saveProducts()` — guarda los productos.
* `formatPrice(amount)` — formatea los precios.
* `renderProducts()` — muestra los productos.
* `renderPagination(totalPages)` — administra la paginación.
* `editProduct(id)` — permite editar un producto.
* `startInlineProduct(id)` — inicia la edición directamente en la tabla.
* `cancelInlineProduct()` — cancela la edición.
* `saveInlineProduct(id)` — guarda los cambios realizados.
* `deleteProduct(id)` — elimina un producto después de solicitar confirmación.

### Búsqueda

La búsqueda permite localizar productos mediante su información registrada.

### Paginación

Se muestran hasta **10 productos por página**.

### Importación CSV

El sistema permite importar productos desde archivos CSV para facilitar la carga de información.

### Registro de productos

El formulario permite agregar nuevos productos y asignarles automáticamente un identificador único utilizando la fecha y hora actual.

---

# 5. `proveedores.js`

Archivo encargado de administrar los **proveedores de Dali Medica**.

La información se almacena en:

`dali_providers`

### Datos administrados

Cada proveedor puede contener:

* Nombre.
* Persona de contacto.
* Correo electrónico.
* Teléfono.
* Notas.
* ID.

### Funciones principales

* `saveProviders()` — guarda la información de proveedores.
* `renderProviders()` — muestra los proveedores en la tabla.
* `renderPagination(totalPages)` — genera la paginación.
* `editProvider(id)` — carga la información de un proveedor para editarlo.
* `startInlineProvider(id)` — inicia la edición desde la tabla.
* `cancelInlineProvider()` — cancela una edición.
* `saveInlineProvider(id)` — guarda los cambios.
* `deleteProvider(id)` — elimina un proveedor después de confirmar la acción.

### Búsqueda

El sistema permite buscar proveedores utilizando:

* Nombre.
* Correo electrónico.
* Teléfono.

### Paginación

La tabla está configurada para mostrar hasta **10 proveedores por página**.

### Importación CSV

Se implementó la posibilidad de importar proveedores mediante archivos CSV.

---

# 6. `generador-datos.js`

Archivo utilizado para **generar información ficticia de prueba** para el sistema.

Su objetivo principal es facilitar las pruebas del CRUD sin tener que introducir manualmente grandes cantidades de información.

### Datos generados

El sistema puede generar:

* Clientes.
* Proveedores.
* Productos.

### Funciones principales

* `aleatorio(lista)` — selecciona un elemento aleatorio de una lista.
* `numeroAleatorio(min, max)` — genera números aleatorios dentro de un rango.
* `telefonoCR()` — genera números telefónicos con formato utilizado en Costa Rica.
* `quitarAcentos(texto)` — elimina acentos de una cadena.
* `emailDesdeNombre(nombre, apellido)` — genera correos electrónicos a partir de nombres.
* `generarClientes(cantidad)` — genera clientes ficticios.
* `generarProveedores(cantidad)` — genera proveedores ficticios.
* `generarProductos(cantidad)` — genera productos ficticios.

### Información utilizada

Para generar los datos se utilizan listas de:

* Nombres.
* Apellidos.
* Dominios de correo electrónico.
* Tipos de productos.
* Nombres de productos.
* Empresas proveedoras.

Esto permite crear rápidamente información suficiente para comprobar el funcionamiento de las tablas, búsquedas, paginación y operaciones CRUD.

---

# 7. `site-header.js`

Archivo encargado de generar y administrar dinámicamente el **encabezado y menú de navegación** del sitio.

### Funcionalidades principales

* Detectar si el usuario se encuentra en una página pública o privada.
* Obtener la sesión actual.
* Mostrar diferentes opciones dependiendo del estado de autenticación.
* Mostrar el nombre del usuario conectado.
* Crear enlaces de navegación dinámicamente.
* Mostrar el acceso al Dashboard para empleados y administradores.
* Mostrar la opción de iniciar sesión cuando no existe una sesión.
* Mostrar la opción de cerrar sesión cuando existe una sesión.
* Permitir regresar a la página principal mediante el logo.

### Funciones principales

* `getSession()` — obtiene la sesión almacenada.
* `setSession(session)` — guarda una sesión.
* `clearSession()` — elimina la sesión.
* `buildNav(session)` — construye las opciones del menú.
* `renderHeader()` — genera el encabezado.
* `attachLogout()` — conecta el botón de cerrar sesión con su funcionalidad.

### Navegación dinámica

El menú se adapta dependiendo de dónde se encuentre el usuario.

En páginas públicas se muestran opciones como:

* Inicio.
* Productos.
* Nosotros.
* Contactos.
* Iniciar sesión.

Cuando el usuario está autenticado también pueden aparecer:

* Dashboard.
* Cerrar sesión.

---

# 8. `accordion.js`

Archivo encargado de implementar el comportamiento de los elementos tipo **acordeón** utilizados en la interfaz.

### Funcionamiento

Cuando el usuario hace clic sobre un elemento del acordeón, JavaScript cambia su estado para mostrar u ocultar el contenido correspondiente.

### Funcionalidad principal

* Detectar el evento `click`.
* Mostrar el contenido seleccionado.
* Ocultar o modificar el estado del contenido.
* Permitir una interfaz más organizada y dinámica.

El comportamiento se inicializa mediante el evento:

`DOMContentLoaded`

Esto garantiza que los elementos HTML estén disponibles antes de intentar manipularlos.

---

# Almacenamiento de datos

El proyecto utiliza principalmente `localStorage` como sistema de almacenamiento local.

Entre las claves utilizadas se encuentran:

| Clave            | Información            |
| ---------------- | ---------------------- |
| `dm_usuarios`    | Usuarios registrados   |
| `dm_sesion`      | Sesión actual          |
| `dm_asistencia`  | Registro de asistencia |
| `dm_clientes`    | Clientes               |
| `dali_products`  | Productos              |
| `dali_providers` | Proveedores            |

El proyecto combina el uso del módulo `storage.js` para determinadas operaciones y acceso directo a `localStorage` en módulos que ya utilizaban ese mecanismo.

---

# Tecnologías y conceptos utilizados

Durante el desarrollo del JavaScript se utilizaron los siguientes conceptos:

* JavaScript.
* DOM.
* Eventos.
* `addEventListener()`.
* `localStorage`.
* JSON.
* Funciones.
* Arreglos.
* Objetos.
* Métodos de arreglos como `find()`, `filter()`, `map()`, `slice()` y `findIndex()`.
* Manipulación dinámica del HTML.
* Formularios.
* Validaciones.
* Expresiones regulares.
* Promesas.
* `async/await`.
* Importación de archivos CSV.
* Paginación.
* Búsqueda dinámica.
* Debounce.
* CRUD.
* Control de sesiones.
* Control de acceso mediante roles.
* Generación de datos aleatorios.
* Modales personalizados.
* Redirecciones entre páginas.

---

# Integración con HTML

Los archivos JavaScript se conectan con las diferentes páginas HTML del proyecto mediante etiquetas `<script>`.

JavaScript utiliza elementos del DOM mediante métodos como:

* `document.getElementById()`
* `document.querySelector()`
* `document.createElement()`
* `addEventListener()`

También se utilizan eventos como:

* `DOMContentLoaded`
* `click`
* `submit`
* `input`
* `change`

Esto permite que las páginas HTML sean interactivas y que los datos puedan ser modificados sin necesidad de recargar manualmente toda la información.

---

# Validaciones y seguridad

Se implementaron diferentes mecanismos para mejorar el funcionamiento del sistema:

* Validación de credenciales.
* Control de sesiones.
* Control de acceso mediante roles.
* Validación de correos electrónicos.
* Validación de números telefónicos.
* Confirmación antes de eliminar información.
* Escape de contenido HTML en los registros de clientes.
* Protección de páginas privadas.
* Redirección de usuarios no autenticados.
* Manejo de errores durante la lectura de archivos CSV.

El sistema utiliza autenticación y almacenamiento local con fines académicos. No sustituye un sistema de autenticación y base de datos seguro para un entorno de producción.

---

# Flujo general del sistema

El funcionamiento general del JavaScript puede resumirse de la siguiente manera:

```text
Usuario
   ↓
Página pública
   ↓
Registro / Inicio de sesión
   ↓
Validación de credenciales
   ↓
Creación de sesión
   ↓
Verificación de rol
   ↓
Dashboard / Página privada
   ↓
CRUD de Clientes
CRUD de Productos
CRUD de Proveedores
   ↓
LocalStorage
   ↓
Cierre de sesión
```

---

# Problemas encontrados y soluciones

Durante el desarrollo se realizaron diferentes ajustes para lograr la integración entre los archivos JavaScript y las páginas HTML.

### Integración del almacenamiento

Se implementó `storage.js` para centralizar operaciones comunes de almacenamiento como crear, consultar, actualizar y eliminar información.

### Manejo de sesiones

Se implementó un sistema de sesión utilizando `localStorage`, permitiendo identificar al usuario actualmente conectado.

### Control de permisos

Se agregó un sistema de roles para diferenciar las funciones disponibles para administradores y empleados.

### Rutas entre páginas

Se implementaron funciones para resolver las rutas entre las carpetas de páginas públicas y privadas, evitando problemas al realizar redirecciones.

### Manipulación dinámica de tablas

Los módulos de clientes, productos y proveedores generan dinámicamente las filas de sus respectivas tablas mediante JavaScript.

### Importación de información

Se agregó soporte para archivos CSV para facilitar la incorporación de grandes cantidades de registros.

### Edición directa

Se implementó edición directamente desde las tablas mediante campos dinámicos, evitando tener que navegar a otra página.

### Confirmaciones

Se agregaron ventanas de confirmación antes de operaciones importantes como eliminar registros.

---

# Historial de desarrollo

* Creación del módulo de almacenamiento `storage.js`.
* Desarrollo del sistema de autenticación mediante `Auth.js`.
* Implementación del registro e inicio de sesión.
* Implementación del control de sesiones.
* Implementación de roles de usuario.
* Implementación del registro de asistencia.
* Desarrollo del CRUD de clientes.
* Desarrollo del CRUD de productos.
* Desarrollo del CRUD de proveedores.
* Implementación de búsqueda.
* Implementación de paginación.
* Implementación de edición directa en tablas.
* Implementación de importación mediante CSV.
* Creación del generador de datos de prueba.
* Implementación del encabezado y navegación dinámica.
* Implementación del acordeón.
* Implementación de modales personalizados.
* Integración de los diferentes módulos JavaScript con las páginas HTML.

---

# Conclusión

El desarrollo de JavaScript permitió transformar las páginas HTML de Dali Medica en un sistema web interactivo.

Se implementaron funcionalidades completas para la administración de usuarios, sesiones, clientes, productos y proveedores, además de herramientas de búsqueda, paginación, importación de datos y generación de información de prueba.

La utilización de `localStorage` permitió simular una base de datos y mantener la información durante la navegación del usuario. Asimismo, la separación del código en diferentes archivos facilitó la organización y mantenimiento del proyecto.

En conjunto, los módulos desarrollados permiten que Dali Medica cuente con una estructura funcional para la gestión administrativa de su información desde el navegador.
