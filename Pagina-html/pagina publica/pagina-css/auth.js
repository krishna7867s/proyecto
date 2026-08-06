function verificarSesion(){
  if(!obtenerUsuario()){
    window.location.href = '../pagina%20publica/login.html';
    return false;
  }
  return true;
}

function mostrarInfoUsuario(){
  const usuario = obtenerUsuario();
  const nombreSpan = document.getElementById('nombreUsuario');
  if(usuario && nombreSpan){
    nombreSpan.textContent = usuario.email || usuario.usuario || 'Usuario';
  }
}

function inicializarLogin(){
  const formulario = document.getElementById('formLogin');
  if(!formulario) return;
  formulario.addEventListener('submit', function(e){
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;
    const mensajeError = document.getElementById('mensajeError');
    if(!usuario || !password){
      mensajeError.textContent = 'Ingresa correo y contraseña.';
      return;
    }
    const usuarioRegistrado = JSON.parse(localStorage.getItem('dali_user')||'null');
    if(!usuarioRegistrado){
      mensajeError.textContent = 'No existe una cuenta registrada. Usa "Crear usuario".';
      return;
    }
    if(usuarioRegistrado.email !== usuario || usuarioRegistrado.password !== password){
      mensajeError.textContent = 'Usuario o contraseña incorrectos.';
      return;
    }
    guardarUsuario(usuarioRegistrado);
    window.location.href = '../pagina%20privada/dashboard.html';
  });
}

function inicializarRegistro(){
  const formulario = document.getElementById('signup');
  if(!formulario) return;
  formulario.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('msg');
    if(!email || !password){
      if(mensaje) mensaje.textContent = 'Completa los datos.';
      return;
    }
    const usuario = {email,password};
    guardarUsuario(usuario);
    if(mensaje){
      mensaje.textContent = 'Usuario creado. Redirigiendo...';
    }
    setTimeout(function(){
      window.location.href = '../pagina%20privada/dashboard.html';
    }, 800);
  });
}

document.addEventListener('DOMContentLoaded', function(){
  inicializarLogin();
  inicializarRegistro();
});
