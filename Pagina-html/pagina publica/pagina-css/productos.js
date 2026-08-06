const cart = JSON.parse(localStorage.getItem('dali_cart') || '[]');
let currentRecipeProduct = null;

function saveCart(){
  localStorage.setItem('dali_cart', JSON.stringify(cart));
}

function formatPrice(value){
  return '₡' + value.toLocaleString('es-ES');
}

function renderCart(){
  const cartItems = document.getElementById('cartItems');
  const totalElement = document.getElementById('cartTotal');
  const cartMessage = document.getElementById('cartMessage');
  cartMessage.textContent = '';
  cartItems.innerHTML = '';
  let total = 0;
  if(cart.length === 0){
    cartItems.innerHTML = '<li>No hay productos en el carrito.</li>';
  } else {
    cart.forEach(function(item, index){
      total += item.price;
      const li = document.createElement('li');
      li.className = 'cart-row';
      li.innerHTML = `<span>${item.name}</span><span>${formatPrice(item.price)} <button onclick="removeFromCart(${index})" style="border:none;background:transparent;color:#d93025;cursor:pointer">Eliminar</button></span>`;
      cartItems.appendChild(li);
    });
  }
  totalElement.textContent = 'Total: ' + formatPrice(total);
}

function addToCart(button){
  const card = button.closest('.item');
  const item = { id: card.dataset.id, name: card.dataset.name, price: Number(card.dataset.price), locked: card.dataset.locked === 'true' };
  if(item.locked){ selectRecipe(button); return; }
  cart.push(item);
  saveCart();
  renderCart();
}

function removeFromCart(index){
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function selectRecipe(button){
  const card = button.closest('.item');
  currentRecipeProduct = { id: card.dataset.id, name: card.dataset.name, price: Number(card.dataset.price) };
  document.getElementById('uploadTitle').textContent = 'Subir receta para ' + currentRecipeProduct.name;
  document.getElementById('uploadMessage').textContent = '';
  document.getElementById('recipeFile').value = '';
  document.getElementById('uploadArea').style.display = 'block';
  document.getElementById('recipeFile').focus();
}

function cancelRecipe(){
  currentRecipeProduct = null;
  document.getElementById('uploadArea').style.display = 'none';
  document.getElementById('uploadMessage').textContent = '';
}

function validateRecipe(){
  const fileInput = document.getElementById('recipeFile');
  const message = document.getElementById('uploadMessage');
  const file = fileInput.files[0];
  if(!file){ message.style.color = 'red'; message.textContent = 'Selecciona una imagen o PDF de la receta.'; return; }
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if(!validTypes.includes(file.type)){
    message.style.color = 'red';
    message.textContent = 'Formato no válido. Usa PDF o imagen.';
    return;
  }
  const nameLower = file.name.toLowerCase();
  const isValid = nameLower.includes('receta') || nameLower.includes('medico') || file.type === 'application/pdf';
  if(isValid && currentRecipeProduct){
    cart.push(currentRecipeProduct);
    saveCart();
    renderCart();
    message.style.color = 'green';
    message.textContent = 'Receta válida. Producto agregado al carrito.';
    setTimeout(cancelRecipe, 1200);
  } else {
    message.style.color = 'orange';
    message.textContent = 'La IA no reconoce claramente la receta. Verifica el documento y vuelve a intentarlo.';
  }
}

function checkout(){
  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  const cartMessage = document.getElementById('cartMessage');
  if(cart.length === 0){ cartMessage.style.color = 'red'; cartMessage.textContent = 'Agrega productos al carrito antes de pagar.'; return; }
  if(!selectedPayment){ cartMessage.style.color = 'red'; cartMessage.textContent = 'Selecciona un método de pago.'; return; }
  cartMessage.style.color = 'green';
  cartMessage.textContent = 'Compra preparada. Método de pago: ' + selectedPayment.value + '.';
  cart.length = 0;
  saveCart();
  renderCart();
}

renderCart();
