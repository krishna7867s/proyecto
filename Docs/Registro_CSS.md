# Registro de CSS — Dali Medica

## Resumen

Documentación del desarrollo de estilos CSS utilizados en el Sistema Administrativo Web de **Dali Medica**.

Los archivos CSS se encargan de definir la apariencia visual de las páginas públicas y privadas, incluyendo colores, tipografías, distribución, formularios, tablas, botones, navegación, tarjetas y diseño responsive.

El proyecto utiliza hojas de estilo separadas para las páginas públicas y privadas.

---

# Archivos CSS

## 1. `Pagina-css/estilos.css`

Archivo principal de estilos utilizado para las páginas públicas del sistema.

Se encuentra dentro de:

`Pagina-html/pagina publica/Pagina-css/`

### Funcionalidades principales

* Definir la identidad visual del sitio.
* Establecer tipografías.
* Configurar colores.
* Diseñar el encabezado.
* Diseñar la navegación.
* Crear estilos para botones.
* Diseñar formularios.
* Estilizar tarjetas y secciones.
* Diseñar el pie de página.
* Adaptar la interfaz a diferentes tamaños de pantalla.

---

# 2. `Pagina_privada-css/estilos.css`

Archivo de estilos utilizado principalmente en las páginas privadas y administrativas.

Se encuentra dentro de:

`Pagina-html/pagina privada/Pagina_privada-css/`

### Funcionalidades principales

* Diseño del dashboard.
* Diseño del menú administrativo.
* Estilos de tablas.
* Formularios administrativos.
* Botones de acciones.
* Tarjetas de información.
* Paginación.
* Mensajes y alertas.
* Diseño responsive.
* Organización visual de las páginas privadas.

---

# Diseño general

El sistema utiliza CSS para mantener una apariencia visual consistente entre las diferentes páginas.

Los estilos se aplican a:

* Encabezados.
* Menús.
* Contenedores.
* Formularios.
* Botones.
* Tablas.
* Tarjetas.
* Secciones.
* Pie de página.

---

# Encabezado y navegación

Los estilos del encabezado permiten organizar el logotipo, menú y opciones del usuario.

### Ejemplo

```css
.site-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
}

.site-nav {
    display: flex;
    gap: 20px;
}

.site-nav a {
    text-decoration: none;
    font-weight: 600;
}
```

Estos estilos permiten mantener los elementos de navegación organizados horizontalmente.

---

# Botones

Los botones utilizan estilos para diferenciar las acciones principales del sistema.

### Ejemplo

```css
.btn {
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.btn:hover {
    opacity: 0.9;
}
```

Los botones se utilizan principalmente para:

* Guardar.
* Editar.
* Eliminar.
* Cancelar.
* Iniciar sesión.
* Registrar usuarios.
* Importar información.

---

# Formularios

Los formularios utilizan estilos para mejorar la presentación y facilitar la interacción del usuario.

### Ejemplo

```css
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 15px;
}

.form-group label {
    font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
}
```

Estos estilos se utilizan en formularios como:

* Inicio de sesión.
* Registro de usuarios.
* Registro de clientes.
* Registro de productos.
* Registro de proveedores.

---

# Tablas

Las tablas administrativas reciben estilos para facilitar la lectura de los datos.

### Ejemplo

```css
.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.data-table th {
    font-weight: 700;
}
```

Las tablas se utilizan principalmente para mostrar:

* Clientes.
* Productos.
* Proveedores.
* Usuarios.

---

# Tablas responsivas

Para evitar problemas de visualización en pantallas pequeñas, las tablas pueden utilizar un contenedor con desplazamiento horizontal.

```css
.table-container {
    width: 100%;
    overflow-x: auto;
}
```

Esto permite consultar tablas grandes desde dispositivos con pantallas pequeñas.

---

# Tarjetas

Las tarjetas son utilizadas para mostrar información resumida en el dashboard y diferentes secciones del sistema.

### Ejemplo

```css
.card {
    padding: 20px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card h3 {
    margin-top: 0;
}
```

Las tarjetas pueden utilizarse para mostrar:

* Cantidad de clientes.
* Cantidad de productos.
* Cantidad de proveedores.
* Información general.
* Accesos rápidos.

---

# Dashboard

El dashboard utiliza CSS para organizar los diferentes bloques de información.

### Ejemplo

```css
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.dashboard-card {
    padding: 20px;
    border-radius: 10px;
}
```

La utilización de `grid` permite distribuir las tarjetas de información de forma organizada.

---

# Pie de página

El footer utiliza estilos comunes para mantener una presentación consistente.

### Ejemplo

```css
.site-footer {
    width: 100%;
    padding: 25px;
    text-align: center;
    margin-top: 40px;
}

.site-footer p {
    margin: 5px 0;
}
```

El pie de página puede incluir:

* Nombre de la empresa.
* Derechos reservados.
* Información de contacto.
* Enlaces importantes.

---

# Mensajes y alertas

Se utilizan estilos para mostrar mensajes informativos, errores y confirmaciones.

### Ejemplo

```css
.alert {
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 15px;
}

.alert-success {
    border: 1px solid #198754;
}

.alert-error {
    border: 1px solid #dc3545;
}
```

Estos componentes permiten comunicar al usuario el resultado de diferentes acciones.

---

# Paginación

Las páginas administrativas utilizan controles de paginación para navegar entre los registros.

### Ejemplo

```css
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
}

.pagination button {
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
}
```

La paginación se utiliza en:

* Clientes.
* Productos.
* Proveedores.

---

# Diseño responsive

El proyecto utiliza `media queries` para adaptar las páginas a diferentes tamaños de pantalla.

### Ejemplo

```css
@media (max-width: 768px) {

    .site-nav {
        flex-direction: column;
        gap: 10px;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .container {
        width: 95%;
    }
}
```

Esto permite que las páginas puedan utilizarse en:

* Computadoras.
* Tablets.
* Teléfonos móviles.

---

# Contenedores

Los contenedores permiten controlar el ancho y la distribución del contenido.

### Ejemplo

```css
.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
}
```

Esta clase ayuda a mantener el contenido centrado y evita que los elementos ocupen todo el ancho de la pantalla.

---

# Organización visual

El CSS utiliza diferentes propiedades para controlar la distribución de los elementos:

* `display`
* `flex`
* `grid`
* `margin`
* `padding`
* `width`
* `max-width`
* `gap`
* `border`
* `border-radius`
* `box-shadow`
* `font-size`
* `font-weight`

Estas propiedades permiten construir una interfaz organizada y consistente.

---

# Clases reutilizables

Para evitar repetir código, se utilizan clases CSS que pueden aplicarse a diferentes elementos.

Algunos ejemplos son:

* `.container`
* `.btn`
* `.card`
* `.form-group`
* `.table-container`
* `.pagination`
* `.alert`

El uso de clases reutilizables facilita el mantenimiento del código y permite realizar cambios visuales de manera centralizada.

---

# Integración con HTML

Los archivos CSS son vinculados desde las páginas HTML mediante la etiqueta:

```html
<link rel="stylesheet" href="Pagina-css/estilos.css">
```

En las páginas privadas se utiliza la hoja de estilos correspondiente al área administrativa.

---

# Integración con JavaScript

Los estilos CSS trabajan conjuntamente con JavaScript para modificar visualmente determinados elementos según las acciones del usuario.

Por ejemplo:

* Mostrar u ocultar elementos.
* Mostrar mensajes.
* Cambiar estados de botones.
* Mostrar formularios de edición.
* Mostrar contenido dinámico.
* Adaptar elementos de navegación.

---

# Mantenimiento del CSS

Para mantener organizado el proyecto se recomienda:

* Utilizar nombres de clases descriptivos.
* Evitar estilos duplicados.
* Mantener separados los estilos públicos y privados.
* Utilizar clases reutilizables.
* Agrupar estilos relacionados.
* Mantener las media queries al final de la hoja.
* Evitar utilizar estilos inline cuando no sean necesarios.

---

# Conclusión

El desarrollo CSS de Dali Medica permite establecer la apariencia visual y organización de las páginas públicas y privadas del sistema.

Las hojas de estilo proporcionan una interfaz consistente para formularios, tablas, botones, tarjetas, navegación, dashboard y demás componentes utilizados por la aplicación.

El CSS se integra con HTML y JavaScript para proporcionar una interfaz funcional, organizada y adaptable a diferentes tamaños de pantalla.
