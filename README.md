# 🏥 Dali Medica — Sistema Administrativo Web

Sistema web administrativo desarrollado para **Dali Medica**, diseñado para facilitar la gestión de clientes, productos, proveedores y usuarios mediante una interfaz sencilla, organizada y responsiva.

---

## 📋 Descripción del proyecto

**Dali Medica** es un sistema web desarrollado como proyecto académico utilizando tecnologías web del lado del cliente.

El proyecto permite administrar información relacionada con una empresa del sector médico, incluyendo:

* 👥 Gestión de clientes.
* 💊 Gestión de productos médicos.
* 🚚 Gestión de proveedores.
* 👤 Registro e inicio de sesión de usuarios.
* 🔐 Control de acceso mediante roles.
* 📊 Dashboard administrativo.
* 📁 Importación de información mediante archivos CSV.
* 🔎 Búsqueda de registros.
* 📄 Paginación de información.
* ✏️ Edición de registros.
* 🗑️ Eliminación de registros.
* 📦 Generación de datos de prueba.
* 🧭 Navegación dinámica.
* 💾 Almacenamiento local de información.

---

# 🎯 Objetivo

Desarrollar una aplicación web que permita gestionar de manera organizada diferentes recursos administrativos de una empresa médica.

El proyecto busca aplicar conocimientos de:

* HTML5.
* CSS3.
* JavaScript.
* Diseño web.
* Manipulación del DOM.
* Programación orientada a eventos.
* Almacenamiento de datos.
* Validación de formularios.
* CRUD.
* Control de sesiones.
* Control de acceso.
* Organización de proyectos web.

---

# 🛠️ Tecnologías utilizadas

## HTML5

Utilizado para crear la estructura y contenido de las diferentes páginas del sistema.

## CSS3

Utilizado para diseñar la interfaz gráfica, incluyendo:

* Layout.
* Colores.
* Tipografías.
* Botones.
* Formularios.
* Tablas.
* Tarjetas.
* Modales.
* Diseño responsivo.
* Navegación.

## JavaScript

Utilizado para agregar la funcionalidad dinámica del sistema.

Entre sus funciones se encuentran:

* Autenticación.
* Sesiones.
* CRUD.
* Validaciones.
* Búsquedas.
* Paginación.
* Importación CSV.
* Generación de datos.
* Manipulación del DOM.
* Navegación dinámica.
* Almacenamiento local.

## LocalStorage

Se utiliza como sistema de almacenamiento local para conservar la información del proyecto dentro del navegador.

---

# 📁 Estructura del proyecto

```text
proyecto/
│
├── Docs/
│   ├── Registro_HTML.md
│   ├── Registro_CSS.md
│   └── Registro_JavaScript.md
│
├── Pagina-JS/
│   ├── Auth.js
│   ├── accordion.js
│   ├── clientes.js
│   ├── generador-datos.js
│   ├── productos.js
│   ├── proveedores.js
│   ├── site-header.js
│   └── storage.js
│
├── Pagina-CSS/
│   └── archivos CSS del proyecto
│
├── Pagina-HTML/
│   ├── páginas públicas
│   └── páginas privadas
│
├── img/
│   └── imágenes utilizadas por el proyecto
│
└── README.md
```

> Los nombres exactos de las carpetas pueden variar dependiendo de la organización final del repositorio.

---

# 🌐 Páginas del sistema

El proyecto se divide en páginas públicas y privadas.

## 🌎 Páginas públicas

Las páginas públicas pueden ser consultadas sin iniciar sesión.

Entre ellas se encuentran:

* Inicio.
* Productos.
* Nosotros.
* Contacto.
* Inicio de sesión.
* Registro.

Estas páginas permiten conocer la empresa y acceder al sistema.

---

# 🔐 Páginas privadas

Las páginas privadas requieren que el usuario tenga una sesión activa.

Entre sus funcionalidades se encuentran:

* Dashboard.
* Gestión de clientes.
* Gestión de productos.
* Gestión de proveedores.
* Administración de usuarios.
* Control de información administrativa.

---

# 👥 Sistema de usuarios

El sistema cuenta con autenticación y diferentes niveles de acceso.

## 👑 Administrador

El administrador posee permisos para acceder a las funciones administrativas del sistema.

Puede realizar operaciones relacionadas con:

* Usuarios.
* Clientes.
* Productos.
* Proveedores.
* Dashboard.
* Información administrativa.

## 👨‍💼 Empleado

El empleado puede utilizar las funciones administrativas asignadas por el sistema.

Entre ellas:

* Consultar información.
* Gestionar registros.
* Trabajar con clientes.
* Trabajar con productos.
* Trabajar con proveedores.

## 👤 Cliente

El rol de cliente está destinado a usuarios externos que interactúan con el sistema de acuerdo con los permisos establecidos.

---

# 🔑 Usuarios de prueba

Para facilitar las pruebas del sistema se incluyen usuarios predeterminados.

### Administrador

```text
Usuario: admin
Correo: admin@dalimedica.cr
Contraseña: admin123
Rol: admin
```

### Empleado

```text
Usuario: operador
Correo: operador@dalimedica.cr
Contraseña: operador123
Rol: empleado
```

> Estas credenciales son únicamente para pruebas del proyecto académico.

---

# 📦 Módulos principales

## 👥 Clientes

Permite administrar los clientes registrados.

### Funcionalidades

* Crear clientes.
* Consultar clientes.
* Editar clientes.
* Eliminar clientes.
* Buscar clientes.
* Paginar resultados.
* Importar clientes mediante CSV.

---

## 💊 Productos

Permite administrar los productos médicos.

### Funcionalidades

* Registrar productos.
* Consultar productos.
* Editar productos.
* Eliminar productos.
* Buscar productos.
* Paginar resultados.
* Importar productos mediante CSV.
* Mostrar precios.
* Indicar si un producto requiere receta.

---

## 🚚 Proveedores

Permite administrar los proveedores de la empresa.

### Funcionalidades

* Crear proveedores.
* Consultar proveedores.
* Editar proveedores.
* Eliminar proveedores.
* Buscar proveedores.
* Paginar resultados.
* Importar proveedores mediante CSV.

---

# 📊 CRUD

Los módulos administrativos utilizan operaciones CRUD:

| Operación | Función                |
| --------- | ---------------------- |
| Create    | Crear nuevos registros |
| Read      | Consultar información  |
| Update    | Modificar registros    |
| Delete    | Eliminar registros     |

Estas operaciones se encuentran principalmente implementadas en los módulos de:

* Clientes.
* Productos.
* Proveedores.

---

# 🔎 Búsqueda

Los módulos administrativos cuentan con sistemas de búsqueda para facilitar la localización de información.

La búsqueda puede realizarse utilizando diferentes campos dependiendo del módulo.

Por ejemplo:

### Clientes

* Nombre.
* Correo.
* Teléfono.

### Proveedores

* Nombre.
* Correo.
* Teléfono.

### Productos

* Nombre.
* Tipo.
* Información relacionada.

---

# 📄 Paginación

Las tablas administrativas utilizan paginación para evitar mostrar todos los registros simultáneamente.

La configuración utilizada permite mostrar aproximadamente:

```text
10 registros por página
```

Esto mejora la organización y facilita la navegación cuando existen muchos registros.

---

# 📁 Importación CSV

El sistema permite importar información mediante archivos `.csv`.

Esto facilita la incorporación de grandes cantidades de registros sin necesidad de introducirlos manualmente uno por uno.

Los módulos que utilizan esta funcionalidad incluyen:

* Clientes.
* Productos.
* Proveedores.

---

# 🧪 Generador de datos

El proyecto incluye un módulo para generar información ficticia.

Este módulo permite crear rápidamente registros de prueba para:

* Clientes.
* Productos.
* Proveedores.

Su objetivo es facilitar las pruebas de:

* CRUD.
* Búsquedas.
* Paginación.
* Tablas.
* Formularios.

---

# 💾 Almacenamiento

El proyecto utiliza `localStorage` del navegador.

Entre las principales claves utilizadas se encuentran:

```text
dm_usuarios
dm_sesion
dm_asistencia
dm_clientes
dali_products
dali_providers
```

Los datos se almacenan en formato JSON para poder trabajar con estructuras de objetos y arreglos.

---

# 🔐 Autenticación

El módulo `Auth.js` controla el sistema de autenticación.

El proceso general es:

```text
Usuario
   ↓
Introduce credenciales
   ↓
JavaScript valida información
   ↓
¿Credenciales correctas?
   ↓
Sí
   ↓
Crear sesión
   ↓
Guardar sesión en LocalStorage
   ↓
Verificar rol
   ↓
Permitir acceso
```

Si las credenciales son incorrectas, el sistema muestra un mensaje y evita el acceso.

---

# 🛡️ Control de acceso

El sistema utiliza roles para determinar qué páginas puede consultar cada usuario.

El proceso es:

```text
Usuario autenticado
        ↓
Obtener sesión
        ↓
Obtener rol
        ↓
Verificar permisos
        ↓
¿Tiene permiso?
   ↙           ↘
 Sí             No
 ↓               ↓
Acceso       Redirección
```

Esto permite proteger las páginas administrativas frente a usuarios que no tienen autorización.

---

# 🧭 Navegación dinámica

El archivo `site-header.js` genera dinámicamente el encabezado y las opciones de navegación.

El contenido del menú cambia dependiendo de:

* Estado de autenticación.
* Página actual.
* Rol del usuario.

Esto evita tener que duplicar manualmente el mismo encabezado en todas las páginas.

---

# 🎨 Interfaz

La interfaz fue diseñada buscando una experiencia sencilla y organizada.

Se utilizan componentes como:

* Barra de navegación.
* Botones.
* Formularios.
* Tablas.
* Tarjetas.
* Modales.
* Acordeones.
* Mensajes de alerta.
* Elementos responsivos.

El diseño está orientado a que el usuario pueda acceder rápidamente a las funciones administrativas.

---

# 📱 Diseño responsivo

El proyecto utiliza CSS para adaptar la interfaz a diferentes tamaños de pantalla.

Se contemplan principalmente:

* Computadoras.
* Tablets.
* Dispositivos móviles.

La estructura responsiva permite mantener la navegación y los componentes utilizables en diferentes resoluciones.

---

# ⚙️ Instalación y ejecución

El proyecto no requiere un servidor backend para funcionar.

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Entrar a la carpeta

```bash
cd proyecto
```

### 3. Abrir el proyecto

Se puede abrir la página principal utilizando un navegador web.

También se recomienda utilizar **Visual Studio Code** junto con una extensión como **Live Server** para ejecutar el proyecto durante el desarrollo.

### 4. Iniciar sesión

Utilizar uno de los usuarios de prueba:

```text
Usuario: admin
Contraseña: admin123
```

o:

```text
Usuario: operador
Contraseña: operador123
```

---

# 🧑‍💻 Desarrollo

El proyecto se organizó separando las responsabilidades de cada tecnología:

```text
HTML
 ↓
Estructura de las páginas

CSS
 ↓
Diseño y presentación

JavaScript
 ↓
Lógica y funcionalidad

LocalStorage
 ↓
Persistencia local
```

Esta separación permite modificar una parte del sistema sin afectar directamente las demás.

---

# 📚 Documentación

La carpeta `Docs` contiene documentación específica del desarrollo:

```text
Docs/
│
├── Registro_HTML.md
├── Registro_CSS.md
└── Registro_JavaScript.md
```

Cada documento registra el trabajo realizado en su respectiva tecnología.

---

# 🚀 Funcionalidades implementadas

| Funcionalidad        | Estado |
| -------------------- | :----: |
| Página principal     |    ✅   |
| Navegación           |    ✅   |
| Diseño responsivo    |    ✅   |
| Registro de usuarios |    ✅   |
| Inicio de sesión     |    ✅   |
| Cierre de sesión     |    ✅   |
| Control de roles     |    ✅   |
| Dashboard            |    ✅   |
| CRUD de clientes     |    ✅   |
| CRUD de productos    |    ✅   |
| CRUD de proveedores  |    ✅   |
| Búsqueda             |    ✅   |
| Paginación           |    ✅   |
| Importación CSV      |    ✅   |
| Generador de datos   |    ✅   |
| LocalStorage         |    ✅   |
| Modales              |    ✅   |
| Acordeones           |    ✅   |
| Validaciones         |    ✅   |

---

# 📌 Consideraciones

Este proyecto utiliza `localStorage` como mecanismo de almacenamiento debido a su naturaleza académica.

Por lo tanto:

* Los datos dependen del navegador utilizado.
* Los datos no se sincronizan entre diferentes dispositivos.
* No existe una base de datos externa.
* El sistema de autenticación no debe considerarse seguro para producción.
* Las contraseñas de prueba se utilizan únicamente con fines académicos.

Para convertir el proyecto en una aplicación de producción sería necesario implementar un backend, una base de datos y un sistema de autenticación seguro.

---

# 👨‍💻 Autor

**Sebastián Flores**

Proyecto académico — **Dali Medica**

---

# 📄 Licencia

Proyecto desarrollado con fines **académicos y educativos**.
