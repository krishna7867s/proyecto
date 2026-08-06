function guardarUsuario(usuario){
  localStorage.setItem('dali_user', JSON.stringify(usuario));
}

function obtenerUsuario(){
  return JSON.parse(localStorage.getItem('dali_user')||'null');
}

function cerrarSesion(){
  localStorage.removeItem('dali_user');
}

function guardarProductos(productos){
  localStorage.setItem('dali_products', JSON.stringify(productos));
}

function obtenerProductos(){
  return JSON.parse(localStorage.getItem('dali_products')||'[]');
}

function guardarProveedores(proveedores){
  localStorage.setItem('dali_providers', JSON.stringify(proveedores));
}

function obtenerProveedores(){
  return JSON.parse(localStorage.getItem('dali_providers')||'[]');
}
