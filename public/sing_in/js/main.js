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

// Mostrar / Ocultar contraseña
togglePassBtn.addEventListener('click', function () {
  const tipo = inputPass.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPass.setAttribute('type', tipo);
  inputConfirm.setAttribute('type', tipo);

  if (tipo === 'text') {
    iconEye.classList.add('hidden');
    iconEyeOff.classList.remove('hidden');
  } else {
    iconEye.classList.remove('hidden');
    iconEyeOff.classList.add('hidden');
  }
});

// Validación en tiempo real de los requisitos
function validarRequisitos() {
  const p = inputPass.value;
  setRule('rule-length',  p.length >= 8 && p.length <= 20);
  setRule('rule-upper',   /[A-Z]/.test(p));
  setRule('rule-lower',   /[a-z]/.test(p));
  setRule('rule-num',     /\d/.test(p));
  setRule('rule-special', /[!@#$%^&*(),.?":{}|<>]/.test(p));
  setRule('rule-space',   !/\s/.test(p));
}

function setRule(id, ok) {
  const el = document.getElementById(id);
  if (el) {
    if (ok) el.classList.add('ok');
    else    el.classList.remove('ok');
  }
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

// ─── EVENTO ENVIAR FORMULARIO (CONEXIÓN BACKEND) ───
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  errorMsg.textContent = '';

  const nombre   = inputName.value.trim();
  const email    = inputEmail.value.trim();
  const pass     = inputPass.value;
  const confirm  = inputConfirm.value;

  // Validaciones de seguridad en Frontend
  if (!nombre) { 
    errorMsg.textContent = 'Ingresa tu nombre completo.'; 
    return; 
  }
  if (!email) { 
    errorMsg.textContent = 'Ingresa tu correo electrónico.'; 
    return; 
  }
  if (pass !== confirm) {
    errorMsg.textContent = 'Las contraseñas no coinciden.';
    return;
  }

  // 1. Armamos el objeto con la estructura que requiere auth.controller.js
  const datosUsuario = {
    nombre_completo: nombre,
    correo: email,
    contrasena: pass,
    id_tipo_usuario: 1 // 1 = "Dueño de mascota" según los catálogos de tu base de datos
  };

  try {
    // Deshabilitamos el botón para evitar clics dobles mientras procesa MySQL
    btnSubmit.disabled = true;
    errorMsg.style.color = '#64748b';
    errorMsg.textContent = 'Registrando usuario en la base de datos...';

    // 2. Hacemos la petición HTTP POST hacia el servidor central (server.js)
    const respuesta = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosUsuario)
    });

    const resultado = await respuesta.json();

    // 3. Manejamos la respuesta del backend
    if (respuesta.ok) {
      alert('¡Usuario registrado con éxito en la base de datos!');
      // Redirecciona al usuario a la pantalla de Login oficial
      window.location.href = '../login/login.html'; 
    } else {
      // Si el controlador arrojó un error controlado (ej. Correo duplicado - 409)
      btnSubmit.disabled = false;
      errorMsg.style.color = '#ef4444';
      errorMsg.textContent = resultado.error || 'Hubo un error al registrar el usuario.';
    }

  } catch (error) {
    // Si el servidor de Node.js está apagado o hay falla de red local
    console.error('Error de red al intentar conectar con la API:', error);
    btnSubmit.disabled = false;
    errorMsg.style.color = '#ef4444';
    errorMsg.textContent = 'No se pudo establecer conexión con el servidor. Verifica que esté activo.';
  }
});