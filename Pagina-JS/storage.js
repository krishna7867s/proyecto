/**
 * Motor de Base de Datos Simulada - Dali Medica
 * Maneja todas las transacciones de LocalStorage de forma centralizada.
 */

const PREFIX = 'dm_';

// Función auxiliar interna para asegurar que la llave siempre tenga el prefijo 'dm_'
function getFullKey(key) {
    return key.startsWith(PREFIX) ? key : PREFIX + key;
}

/**
 * Obtiene un arreglo de datos desde LocalStorage.
 * @param {string} key - Nombre de la "tabla" (ej. 'usuarios')
 * @returns {Array} - Arreglo de objetos (o vacío si no existe)
 */
function getData(key) {
    const data = localStorage.getItem(getFullKey(key));
    return data ? JSON.parse(data) : [];
}

/**
 * Sobrescribe la llave entera con un nuevo arreglo.
 * @param {string} key - Nombre de la "tabla"
 * @param {Array} data - El arreglo completo a guardar
 */
function saveData(key, data) {
    localStorage.setItem(getFullKey(key), JSON.stringify(data));
}

/**
 * Agrega un solo objeto al final del arreglo.
 * Si el objeto no trae 'id', le genera uno automáticamente.
 * @param {string} key - Nombre de la "tabla"
 * @param {Object} item - Objeto a guardar (ej. { nombre: "Juan" })
 * @returns {Object} - El objeto guardado (con su ID)
 */
function addItem(key, item) {
    const data = getData(key);
    
    // Generar un ID único basado en el tiempo si no tiene uno
    if (!item.id) {
        item.id = Date.now().toString(); 
    }
    
    data.push(item);
    saveData(key, data);
    return item;
}

/**
 * Actualiza un objeto existente buscándolo por su ID.
 * @param {string} key - Nombre de la "tabla"
 * @param {string|number} id - El ID del elemento a buscar
 * @param {Object} newData - Los nuevos datos a sobrescribir
 * @returns {Object|null} - El objeto actualizado o null si no lo encuentra
 */
function updateItem(key, id, newData) {
    const data = getData(key);
    const index = data.findIndex(item => item.id === id || item.id === String(id));
    
    if (index !== -1) {
        // Mantiene el ID original intacto y sobrescribe el resto de propiedades
        data[index] = { ...data[index], ...newData, id: data[index].id };
        saveData(key, data);
        return data[index];
    }
    console.warn(`No se encontró el ID ${id} en ${key} para actualizar.`);
    return null;
}

/**
 * Elimina un objeto del arreglo basado en su ID.
 * @param {string} key - Nombre de la "tabla"
 * @param {string|number} id - El ID del elemento a eliminar
 */
function deleteItem(key, id) {
    const data = getData(key);
    const filteredData = data.filter(item => item.id !== id && item.id !== String(id));
    saveData(key, filteredData);
}

/**
 * Busca y retorna un solo objeto por su ID.
 * @param {string} key - Nombre de la "tabla"
 * @param {string|number} id - El ID del elemento a buscar
 * @returns {Object|null} - El objeto encontrado o null
 */
function getItemById(key, id) {
    const data = getData(key);
    return data.find(item => item.id === id || item.id === String(id)) || null;
}

/**
 * Parsea un archivo CSV simple y devuelve objetos según columnas esperadas.
 * @param {File} file
 * @param {string[]} columns
 * @returns {Promise<Array<Object>>}
 */
function parseCsvFile(file, columns) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const text = event.target.result || '';
            const lines = text.trim().split(/\r?\n/).filter(Boolean);
            if (!lines.length) {
                reject(new Error('El archivo CSV está vacío.'));
                return;
            }

            const headerLine = lines[0].trim().toLowerCase();
            const hasHeader = columns.some(col => headerLine.includes(col.toLowerCase()));
            const startIndex = hasHeader ? 1 : 0;
            const rows = [];

            for (let i = startIndex; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                columns.forEach((col, idx) => {
                    row[col] = values[idx] || '';
                });
                rows.push(row);
            }

            resolve(rows);
        };
        reader.onerror = () => reject(new Error('No se pudo leer el archivo CSV.'));
        reader.readAsText(file, 'UTF-8');
    });
}