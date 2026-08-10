/**
 * generador-datos.js — Generador de datos de prueba
 * Sistema Administrativo Web · Dali Medica
 *
 * Cumple el requerimiento de la Extensión Avanzada (sección 2):
 * "El equipo debe generar un set de datos de prueba de al menos
 * 200 registros combinados entre clientes, productos y proveedores."
 *
 * IMPORTANTE — cada módulo usa su propio sistema de almacenamiento:
 *   - clientes   → storage.js  (clave: dm_clientes)
 *   - proveedores → localStorage directo (clave: dali_providers)
 *   - productos  → localStorage directo (clave: dali_products)
 *
 * CÓMO USARLO:
 * 1. Pide a tu compañera que agregue temporalmente esta línea en
 *    clientes.html, DESPUÉS de storage.js y ANTES de clientes.js:
 *      <script src="../../Pagina-JS/generador-datos.js"></script>
 * 2. Abre clientes.html en el navegador y en la consola (F12) ejecuta:
 *      ejecutarGenerador();
 * 3. Verifica las tres páginas: clientes.html, proveedores.html,
 *    productos-admin.html — deben mostrar los nuevos registros.
 * 4. Cuando ya no lo necesites, pide que quiten el <script> del HTML.
 */

// ---------------------------------------------------------
// 1. Datos base para generar información realista
// ---------------------------------------------------------

const NOMBRES = [
  "María", "José", "Ana", "Luis", "Carmen", "Carlos", "Laura", "Diego",
  "Sofía", "Andrés", "Valeria", "Kevin", "Gabriela", "Esteban", "Daniela",
  "Marco", "Fernanda", "Ricardo", "Paola", "Jorge", "Melissa", "Alejandro",
  "Natalia", "Sergio", "Karla", "Óscar", "Priscilla", "Manuel", "Vanessa", "Rodrigo",
];

const APELLIDOS = [
  "Rodríguez", "Vargas", "Jiménez", "Mora", "Solís", "Castro", "Rojas",
  "Chacón", "Araya", "Fernández", "Salazar", "Quesada", "Alvarado", "Brenes",
  "Zúñiga", "Campos", "Segura", "Villalobos", "Herrera", "Núñez",
];

const DOMINIOS_EMAIL = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

// Tipos de producto que coinciden exactamente con las opciones del <select>
// en productos-admin.html: Prótesis, Medicamento, Insumo, Equipo
const TIPOS_PRODUCTO = ["Prótesis", "Medicamento", "Insumo", "Equipo"];

const NOMBRES_PRODUCTO = {
  "Prótesis":     ["Prótesis de rodilla", "Prótesis de cadera", "Prótesis de mano",
                   "Prótesis de pie", "Prótesis de hombro", "Implante auditivo"],
  "Medicamento":  ["Analgésico de amplio espectro", "Antibiótico de alta potencia",
                   "Antiinflamatorio", "Sedante clínico", "Suero fisiológico",
                   "Vitamina C inyectable"],
  "Insumo":       ["Guantes de nitrilo (caja)", "Mascarillas quirúrgicas (caja)",
                   "Jeringas desechables", "Gasas estériles", "Batas desechables",
                   "Vendas elásticas"],
  "Equipo":       ["Monitor de signos vitales", "Silla de ruedas eléctrica",
                   "Andador plegable", "Electrocardiógrafo", "Oxímetro de pulso",
                   "Cama hospitalaria eléctrica", "Desfibrilador (DEA)"],
};

const NOMBRES_EMPRESA = [
  "MedSupply CR", "Equipos Hospitalarios del Istmo", "TecnoMédica Centroamericana",
  "Distribuidora Salud Total", "BioEquipos Costa Rica", "Grupo Sanitas Import",
  "MedTech Solutions CR", "Suministros Clínicos Vargas", "Innova Salud Equipos",
  "Corporación Médica Central", "OrtoVida Distribuidora", "Global Med Import",
  "Equipar Salud S.A.", "Vitalcare Suministros", "MedEquip Latinoamérica",
];

// ---------------------------------------------------------
// 2. Utilidades aleatorias
// ---------------------------------------------------------

// Devuelve un elemento al azar de una lista
function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Devuelve un número entero entre min y max (inclusive)
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera un teléfono costarricense de 8 dígitos (inicia en 6, 7 u 8)
function telefonoCR() {
  const inicio = aleatorio(["6", "7", "8"]);
  let resto = "";
  for (let i = 0; i < 7; i++) resto += numeroAleatorio(0, 9);
  return inicio + resto;
}

// Quita tildes para armar emails sin caracteres especiales
function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function emailDesdeNombre(nombre, apellido) {
  const base = quitarAcentos(`${nombre}.${apellido}`).toLowerCase();
  const sufijo = numeroAleatorio(1, 999);
  return `${base}${sufijo}@${aleatorio(DOMINIOS_EMAIL)}`;
}

// ---------------------------------------------------------
// 3. Generadores por entidad
//    Los campos deben coincidir exactamente con lo que espera
//    cada página HTML al leer desde localStorage.
// ---------------------------------------------------------

/**
 * Genera clientes para usar con addItem() de storage.js
 * Campos: name, email, phone, notes (igual que clientes.js)
 */
function generarClientes(cantidad) {
  const clientes = [];
  for (let i = 0; i < cantidad; i++) {
    const nombre   = aleatorio(NOMBRES);
    const apellido = aleatorio(APELLIDOS);
    clientes.push({
      name:  `${nombre} ${apellido}`,
      email: emailDesdeNombre(nombre, apellido),
      phone: telefonoCR(),
      notes: aleatorio([
        "Cliente frecuente", "Hospital privado", "Clínica regional",
        "Requiere factura electrónica", "Compra equipo industrial",
        "Contacto de mantenimiento preferente", "",
      ]),
    });
  }
  return clientes;
}

/**
 * Genera proveedores para guardar en 'dali_providers' (localStorage directo).
 * Campos: name, contact, email, phone, notes
 * — coinciden con lo que guarda y muestra proveedores.html
 */
function generarProveedores(cantidad) {
  const proveedores = [];
  const nombresUsados = new Set();

  for (let i = 0; i < cantidad; i++) {
    // Evitar que dos empresas tengan exactamente el mismo nombre
    let nombreEmpresa = aleatorio(NOMBRES_EMPRESA);
    if (nombresUsados.has(nombreEmpresa)) {
      nombreEmpresa = `${nombreEmpresa} ${numeroAleatorio(2, 9)}`;
    }
    nombresUsados.add(nombreEmpresa);

    const nombreContacto   = aleatorio(NOMBRES);
    const apellidoContacto = aleatorio(APELLIDOS);

    proveedores.push({
      name:    nombreEmpresa,
      contact: `${nombreContacto} ${apellidoContacto}`, // campo "contact", no "contactName"
      email:   emailDesdeNombre(nombreContacto, apellidoContacto),
      phone:   telefonoCR(),
      notes:   aleatorio([
        "Proveedor certificado", "Entrega a domicilio", "Requiere orden de compra",
        "Importación directa", "Distribuidor nacional", "",
      ]),
    });
  }
  return proveedores;
}

/**
 * Genera productos para guardar en 'dali_products' (localStorage directo).
 * Campos: name, type, price, prescription, description
 * — coinciden con lo que guarda y muestra productos-admin.html
 */
function generarProductos(cantidad) {
  const productos = [];
  for (let i = 0; i < cantidad; i++) {
    // El tipo viene del <select> de productos-admin.html
    const tipo = aleatorio(TIPOS_PRODUCTO);

    // Los medicamentos y prótesis requieren receta; insumos y equipo no
    const requiereReceta = (tipo === "Medicamento" || tipo === "Prótesis") ? "si" : "no";

    productos.push({
      name:         aleatorio(NOMBRES_PRODUCTO[tipo]),
      type:         tipo,                              // campo "type", no "category"
      price:        numeroAleatorio(5000, 4500000),    // colones
      prescription: requiereReceta,                   // campo "prescription", no "stock"
      description:  aleatorio([
        "Producto de alta calidad certificado por el Ministerio de Salud.",
        "Disponible para entrega inmediata en todo el país.",
        "Requiere validación previa con el departamento médico.",
        "Importado directamente del fabricante.",
        "Incluye garantía y soporte técnico.",
        "",
      ]),
    });
  }
  return productos;
}

// ---------------------------------------------------------
// 4. Función principal
// ---------------------------------------------------------

function ejecutarGenerador() {
  // Verificar que storage.js está cargado (para poder guardar clientes)
  if (typeof addItem !== "function" || typeof getData !== "function") {
    console.error(
      "No se encontró storage.js. " +
      "Asegúrate de cargarlo antes que generador-datos.js en el HTML."
    );
    return;
  }

  // Leer cuántos registros ya existen en cada módulo
  const clientesActuales    = getData("clientes").length;
  const proveedoresActuales = JSON.parse(localStorage.getItem("dali_providers") || "[]").length;
  const productosActuales   = JSON.parse(localStorage.getItem("dali_products")  || "[]").length;
  const totalActual = clientesActuales + proveedoresActuales + productosActuales;

  if (totalActual >= 200) {
    const continuar = confirm(
      `Ya tienes ${totalActual} registros combinados ` +
      `(${clientesActuales} clientes, ${proveedoresActuales} proveedores, ${productosActuales} productos). ` +
      `¿Quieres generar 200 registros MÁS de todas formas? (Cancelar = no hacer nada)`
    );
    if (!continuar) {
      console.log("Generación cancelada por el usuario.");
      return;
    }
  }

  console.log("Generando datos de prueba...");

  // --- Clientes: usa addItem() de storage.js → clave dm_clientes ---
  const nuevosClientes = generarClientes(70);
  nuevosClientes.forEach((c) => addItem("clientes", c));

  // --- Proveedores: localStorage directo → clave dali_providers ---
  const proveedoresExistentes = JSON.parse(localStorage.getItem("dali_providers") || "[]");
  const nuevosProveedores = generarProveedores(30);
  localStorage.setItem(
    "dali_providers",
    JSON.stringify([...proveedoresExistentes, ...nuevosProveedores])
  );

  // --- Productos: localStorage directo → clave dali_products ---
  const productosExistentes = JSON.parse(localStorage.getItem("dali_products") || "[]");
  const nuevosProductos = generarProductos(100);
  localStorage.setItem(
    "dali_products",
    JSON.stringify([...productosExistentes, ...nuevosProductos])
  );

  const total = nuevosClientes.length + nuevosProveedores.length + nuevosProductos.length;

  console.log(`✅ Listo. Se generaron ${total} registros nuevos:`);
  console.log(`   - Clientes:    ${nuevosClientes.length}  (clave: dm_clientes)`);
  console.log(`   - Proveedores: ${nuevosProveedores.length} (clave: dali_providers)`);
  console.log(`   - Productos:   ${nuevosProductos.length} (clave: dali_products)`);
  console.log("Recarga cada página para ver los datos.");

  return {
    clientes:    nuevosClientes,
    proveedores: nuevosProveedores,
    productos:   nuevosProductos,
  };
}