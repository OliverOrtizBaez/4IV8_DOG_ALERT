// Referencias
const form            = document.getElementById('register-form');
const inputName       = document.getElementById('fullName');
const inputEmail      = document.getElementById('email');
const inputPass       = document.getElementById('password');
const inputConfirm    = document.getElementById('confirmPassword');
const checkTerms      = document.getElementById('terms');
const btnSubmit       = document.getElementById('btn-submit');
const errorMsg        = document.getElementById('error-msg');
const countName       = document.getElementById('count-name');
const countPass       = document.getElementById('count-pass');
const togglePassBtn   = document.getElementById('toggle-pass');
const iconEye         = document.getElementById('icon-eye');
const iconEyeOff      = document.getElementById('icon-eye-off');

// Contadores de caracteres
inputName.addEventListener('input', function () {
  // Sin caracteres invisibles
  this.value = this.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  countName.textContent = this.value.length + '/20';
});

inputPass.addEventListener('input', function () {
  // Sin espacios
  if (/\s/.test(this.value)) { this.value = this.value.replace(/\s/g, ''); }
  countPass.textContent = this.value.length + '/20';
  validarRequisitos();
  actualizarBoton();
});

inputConfirm.addEventListener('input', function () {
  if (/\s/.test(this.value)) { this.value = this.value.replace(/\s/g, ''); }
  actualizarBoton();
});

checkTerms.addEventListener('change', actualizarBoton);

// Toggle contraseña
togglePassBtn.addEventListener('click', function () {
  const visible = inputPass.type === 'text';
  inputPass.type       = visible ? 'password' : 'text';
  inputConfirm.type    = visible ? 'password' : 'text';
  iconEye.style.display    = visible ? 'block' : 'none';
  iconEyeOff.style.display = visible ? 'none'  : 'block';
});

// Validar requisitos de contraseña en tiempo real
function validarRequisitos() {
  const p = inputPass.value;
  setRule('rule-len',     p.length >= 8 && p.length <= 20);
  setRule('rule-upper',   /[A-Z]/.test(p));
  setRule('rule-lower',   /[a-z]/.test(p));
  setRule('rule-num',     /\d/.test(p));
  setRule('rule-special', /[!@#$%^&*(),.?":{}|<>]/.test(p));
  setRule('rule-space',   !/\s/.test(p));
}

function setRule(id, ok) {
  const el = document.getElementById(id);
  if (ok) el.classList.add('ok');
  else    el.classList.remove('ok');
}

function todosRequisitosOk() {
  const p = inputPass.value;
  return (
    p.length >= 8 && p.length <= 20 &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /\d/.test(p) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(p) &&
    !/\s/.test(p)
  );
}

function actualizarBoton() {
  const listo = checkTerms.checked && todosRequisitosOk();
  btnSubmit.disabled = !listo;
}

// Submit
form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorMsg.textContent = '';

  const nombre   = inputName.value.trim();
  const email    = inputEmail.value.trim();
  const pass     = inputPass.value;
  const confirm  = inputConfirm.value;

  if (!nombre) { errorMsg.textContent = 'Ingresa tu nombre.'; return; }
  if (!email)  { errorMsg.textContent = 'Ingresa tu correo.'; return; }
  if (!todosRequisitosOk()) { errorMsg.textContent = 'La contraseña no cumple los requisitos.'; return; }
  if (pass !== confirm) { errorMsg.textContent = 'Las contraseñas no coinciden.'; return; }

  // Simulación — aquí iría la llamada al backend
  console.log('Registro:', { nombre, email });

  // Redirige a selección de tipo de usuario
  window.location.href = "../tipo_de_usuario/tipodeusuario.html";
});