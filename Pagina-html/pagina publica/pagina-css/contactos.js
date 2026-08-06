document.addEventListener('DOMContentLoaded', function(){
  const formulario = document.getElementById('contactForm');
  if(!formulario) return;

  formulario.addEventListener('submit', function(evento){
    evento.preventDefault();
    alert('Mensaje enviado (demo)');
    formulario.reset();
  });
});
