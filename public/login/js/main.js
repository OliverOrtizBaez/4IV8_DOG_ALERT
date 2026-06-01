// Toggle mostrar/ocultar contraseña
const passInput   = document.getElementById('password');
const toggleBtn   = document.getElementById('toggle-pass');
const iconEye     = document.getElementById('icon-eye');
const iconEyeOff  = document.getElementById('icon-eye-off');

toggleBtn.addEventListener('click', function () {
  const visible = passInput.type === 'text';
  passInput.type = visible ? 'password' : 'text';
  iconEye.style.display    = visible ? 'block' : 'none';
  iconEyeOff.style.display = visible ? 'none'  : 'block';
});

// Submit del formulario
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorEl  = document.getElementById('error-msg');

  errorEl.textContent = '';

  if (!email) {
    errorEl.textContent = 'Ingresa tu correo.';
    return;
  }

  if (!password) {
    errorEl.textContent = 'Ingresa tu contraseña.';
    return;
  }

  // Simulación de login — aquí irá la llamada al backend
  console.log('Login con:', email);

  // Redirige al menú (ajusta la ruta si tu carpeta es diferente)
  window.location.href = '../menu/index.html';
});

// Botón Google — simulado
document.getElementById('btn-google').addEventListener('click', function () {
  const errorEl = document.getElementById('error-msg');
  errorEl.textContent = '';

  // Simulación — aquí iría la integración real con Google OAuth
  console.log('Login con Google');
  window.location.href = '../menu/index.html';
});
