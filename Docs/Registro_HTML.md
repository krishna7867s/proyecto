# Registro de HTML — Dali Medica

## Resumen

Documentación del desarrollo de las estructuras HTML utilizadas en el Sistema Administrativo Web de **Dali Medica**.

El código HTML se encarga de definir la estructura, contenido y organización de las páginas públicas y privadas del sistema.

Las páginas HTML se encuentran principalmente dentro de las carpetas:

`proyecto/Pagina-html/pagina publica/`

`proyecto/Pagina-html/pagina privada/`

El desarrollo HTML incluye páginas informativas, formularios de autenticación, gestión de usuarios, clientes, productos, proveedores y diferentes vistas del sistema administrativo.

---

# Estructura de las páginas HTML

## 1. `index.html`

Página principal pública de Dali Medica.

### Funcionalidades principales

* Presentar información general de la empresa.
* Mostrar la navegación principal.
* Presentar los servicios y productos disponibles.
* Permitir acceder a las diferentes secciones públicas.
* Permitir el acceso al inicio de sesión.

La página utiliza una estructura HTML semántica mediante elementos como:

* `header`
* `nav`
* `main`
* `section`
* `footer`

También incorpora los archivos CSS y JavaScript necesarios para el funcionamiento de la página.

---

# 2. Páginas públicas

Las páginas públicas son aquellas que pueden ser consultadas sin iniciar sesión.

Se encuentran en:

`Pagina-html/pagina publica/`

Entre ellas se encuentran:

* `index.html`
* `productos.html`
* `nosotros.html`
* `contactos.html`
* `login.html`
* `crear_usuario.html`

---

## 2.1 `index.html`

Corresponde a la página de inicio del sitio web.

### Elementos principales

* Encabezado.
* Menú de navegación.
* Sección principal de bienvenida.
* Información sobre Dali Medica.
* Secciones informativas.
* Enlaces hacia otras páginas.
* Pie de página.

El encabezado puede ser generado dinámicamente mediante JavaScript.

---

## 2.2 `productos.html`

Página pública destinada a mostrar los productos médicos disponibles.

### Elementos principales

* Título de la sección.
* Contenedor de productos.
* Información de cada producto.
* Precio.
* Descripción.
* Información relacionada con receta médica.
* Navegación.
* Pie de página.

Los productos pueden ser cargados dinámicamente mediante:

`productos.js`

---

## 2.3 `nosotros.html`

Página informativa sobre Dali Medica.

### Contenido

* Información general de la empresa.
* Descripción de la organización.
* Misión.
* Visión.
* Información relacionada con los servicios ofrecidos.

La página utiliza diferentes secciones HTML para organizar la información.

---

## 2.4 `contactos.html`

Página destinada a mostrar información de contacto.

### Elementos principales

* Información de contacto.
* Teléfono.
* Correo electrónico.
* Dirección.
* Horarios de atención.
* Formulario o elementos de contacto.
* Navegación.
* Pie de página.

---

# 3. `login.html`

Página utilizada para iniciar sesión en el sistema.

### Elementos principales

* Campo para usuario o correo electrónico.
* Campo para contraseña.
* Botón de inicio de sesión.
* Enlace para registrarse.
* Mensajes de validación.
* Contenedor para mostrar alertas.

### Ejemplo de estructura

```html
<form id="loginForm">
    <div class="form-group">
        <label for="usuario">Usuario o correo</label>
        <input
            type="text"
            id="usuario"
            name="usuario"
            required
        >
    </div>

    <div class="form-group">
        <label for="password">Contraseña</label>
        <input
            type="password"
            id="password"
            name="password"
            required
        >
    </div>

    <button type="submit">
        Iniciar sesión
    </button>
</form>
```

El formulario se conecta con `Auth.js`, encargado de validar las credenciales y crear la sesión.

---

# 4. `crear_usuario.html`

Página utilizada para registrar nuevos usuarios.

### Campos principales

* Nombre de usuario.
* Nombre completo.
* Correo electrónico.
* Contraseña.
* Rol.
* Botón para registrar.

### Ejemplo de registro

```html
<form id="registroForm">

    <label for="nombre">Nombre completo</label>
    <input
        type="text"
        id="nombre"
        name="nombre"
        required
    >

    <label for="usuario">Usuario</label>
    <input
        type="text"
        id="usuario"
        name="usuario"
        required
    >

    <label for="correo">Correo electrónico</label>
    <input
        type="email"
        id="correo"
        name="correo"
        required
    >

    <label for="password">Contraseña</label>
    <input
        type="password"
        id="password"
        name="password"
        required
    >

    <button type="submit">
        Crear usuario
    </button>

</form>
```

El formulario es procesado mediante JavaScript utilizando la función:

`inicializarRegistro()`

---

# 5. Páginas privadas

Las páginas privadas corresponden al sistema administrativo y requieren una sesión activa.

Se encuentran en:

`Pagina-html/pagina privada/`

Entre ellas se encuentran:

* `index.html`
* `dashboard.html`
* `clientes.html`
* `productos-admin.html`
* `proveedores.html`
* `administrar.html`
* `horarios.html`

El acceso a estas páginas es controlado mediante autenticación y roles.

---

# 6. `dashboard.html`

Página principal del sistema administrativo.

### Elementos principales

* Encabezado administrativo.
* Información del usuario conectado.
* Resumen del sistema.
* Accesos rápidos.
* Estadísticas.
* Enlaces hacia clientes.
* Enlaces hacia productos.
* Enlaces hacia proveedores.
* Pie de página.

El dashboard funciona como punto central para acceder a las diferentes funcionalidades administrativas.

---

# 7. `clientes.html`

Página utilizada para administrar los clientes.

### Funcionalidades HTML

* Formulario para registrar clientes.
* Tabla de clientes.
* Campo de búsqueda.
* Botones de edición.
* Botones de eliminación.
* Paginación.
* Importación de archivos CSV.

### Información mostrada

Cada cliente puede contener:

* ID.
* Nombre.
* Correo.
* Teléfono.
* Notas.

La información es administrada dinámicamente mediante:

`clientes.js`

---

# 8. `productos-admin.html`

Página privada utilizada para administrar los productos médicos.

### Funcionalidades

* Registrar productos.
* Mostrar productos.
* Editar productos.
* Eliminar productos.
* Buscar productos.
* Importar productos mediante CSV.
* Mostrar información de productos en una tabla.

### Datos de producto

* Nombre.
* Tipo.
* Precio.
* Requiere receta.
* Descripción.
* ID.

La funcionalidad dinámica es administrada mediante:

`productos.js`

---

# 9. `proveedores.html`

Página utilizada para administrar los proveedores.

### Funcionalidades

* Registrar proveedores.
* Consultar proveedores.
* Editar proveedores.
* Eliminar proveedores.
* Buscar proveedores.
* Importar información mediante CSV.
* Mostrar resultados en una tabla.

### Datos administrados

* ID.
* Nombre.
* Persona de contacto.
* Correo.
* Teléfono.
* Notas.

La funcionalidad se encuentra implementada principalmente en:

`proveedores.js`

---

# 10. `administrar.html`

Página destinada a las funciones administrativas del sistema.

### Funcionalidades

* Administración de usuarios.
* Visualización de información administrativa.
* Control de funcionalidades según el rol.
* Acceso a herramientas de administración.

El acceso a determinadas opciones depende del rol del usuario autenticado.

---

# 11. `horarios.html`

Página utilizada para mostrar y administrar información relacionada con horarios.

### Elementos principales

* Títulos y secciones informativas.
* Horarios de atención.
* Información organizada mediante tablas o bloques.
* Navegación.
* Pie de página.

---

# Formularios

Los formularios del proyecto utilizan elementos HTML estándar:

* `form`
* `label`
* `input`
* `select`
* `textarea`
* `button`

Se utilizan atributos como:

* `id`
* `name`
* `required`
* `type`
* `placeholder`

Estos elementos permiten realizar validaciones básicas antes de enviar la información a JavaScript.

---

# Tablas administrativas

Las páginas de clientes, productos y proveedores utilizan tablas HTML para presentar la información.

### Ejemplo

```html
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
        </tr>
    </thead>

    <tbody id="tablaClientes">
    </tbody>
</table>
```

El contenido de las tablas es generado dinámicamente mediante JavaScript.

---

# Navegación

Las páginas utilizan enlaces HTML para permitir la navegación entre las diferentes secciones.

Ejemplo:

```html
<nav>
    <a href="index.html">Inicio</a>
    <a href="productos.html">Productos</a>
    <a href="nosotros.html">Nosotros</a>
    <a href="contactos.html">Contactos</a>
    <a href="login.html">Iniciar sesión</a>
</nav>
```

En determinadas páginas, la navegación puede ser generada dinámicamente mediante:

`site-header.js`

---

# Integración con JavaScript

El HTML se conecta con los archivos JavaScript mediante etiquetas `script`.

Ejemplo:

```html
<script src="../../Pagina-JS/Auth.js"></script>
<script src="../../Pagina-JS/storage.js"></script>
<script src="../../Pagina-JS/clientes.js"></script>
```

Esto permite separar la estructura visual de la lógica de programación.

---

# Integración con CSS

Las páginas HTML utilizan archivos CSS para definir la presentación visual.

Ejemplo:

```html
<link rel="stylesheet" href="Pagina-css/estilos.css">
```

En las páginas privadas se utiliza el archivo:

`Pagina_privada-css/estilos.css`

---

# Pie de página

Las páginas incluyen una sección de pie de página para mostrar información general del sitio.

Puede contener:

* Nombre de Dali Medica.
* Información de contacto.
* Enlaces.
* Derechos reservados.
* Año actual.

El footer mantiene una estructura común para conservar la identidad visual del sistema.

---

# Conclusión

El desarrollo HTML de Dali Medica permite estructurar las páginas públicas y privadas del sistema, proporcionando formularios, tablas, navegación y diferentes componentes necesarios para el funcionamiento de la aplicación.

La estructura HTML trabaja conjuntamente con CSS y JavaScript, permitiendo separar la presentación, estructura y comportamiento del sistema.
