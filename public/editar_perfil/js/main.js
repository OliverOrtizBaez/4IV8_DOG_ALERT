// --- Foto de perfil ---
var btnCamara   = document.getElementById('btn-camara');
var inputFoto   = document.getElementById('input-foto');
var avatarImg   = document.getElementById('avatar-img');
var avatarPlaceholder = document.getElementById('avatar-placeholder');

btnCamara.addEventListener('click', function() {
  inputFoto.click();
});

inputFoto.addEventListener('change', function() {
  var file = this.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    avatarImg.src = e.target.result;
    avatarImg.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// --- Toggle mostrar/ocultar contraseña ---
var toggleBtns = document.querySelectorAll('.toggle-pass');

toggleBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var targetId = btn.getAttribute('data-target');
    var input    = document.getElementById(targetId);
    var eyeOn    = btn.querySelector('.icon-eye');
    var eyeOff   = btn.querySelector('.icon-eye-off');

    if (input.type === 'password') {
      input.type = 'text';
      eyeOn.style.display  = 'none';
      eyeOff.style.display = 'block';
    } else {
      input.type = 'password';
      eyeOn.style.display  = 'block';
      eyeOff.style.display = 'none';
    }
  });
});

// --- Guardar cambios ---
var form      = document.getElementById('perfil-form');
var btnGuardar = document.getElementById('btn-guardar');
var msgError  = document.getElementById('msg-error');
var msgOk     = document.getElementById('msg-ok');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  msgError.textContent = '';
  msgOk.textContent    = '';

  var nombre      = document.getElementById('nombre').value.trim();
  var passActual  = document.getElementById('pass-actual').value;
  var passNueva   = document.getElementById('pass-nueva').value;
  var passConfirm = document.getElementById('pass-confirm').value;

  // Validar nombre
  if (!nombre) {
    msgError.textContent = 'El nombre no puede estar vacío.';
    return;
  }

  // Si llenó algún campo de contraseña, validar todos
  if (passActual || passNueva || passConfirm) {
    if (!passActual) {
      msgError.textContent = 'Ingresa tu contraseña actual.';
      return;
    }
    if (passNueva.length < 8) {
      msgError.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (passNueva !== passConfirm) {
      msgError.textContent = 'Las contraseñas nuevas no coinciden.';
      return;
    }
  }

  // Simulación de guardado
  console.log('Perfil guardado:', { nombre: nombre });

  btnGuardar.classList.add('ok');
  btnGuardar.textContent = '✓  ¡Guardado!';
  msgOk.textContent = 'Los cambios se guardaron correctamente.';

  setTimeout(function() {
    btnGuardar.classList.remove('ok');
    btnGuardar.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">' +
      '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>' +
      '<polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
      ' Guardar cambios';
    msgOk.textContent = '';
  }, 3000);
});

// --- Eliminar cuenta ---
var btnEliminar = document.getElementById('btn-eliminar');
var btnCancelar = document.getElementById('btn-cancelar');
var btnConfirmar = document.getElementById('btn-confirmar-delete');
var step1 = document.getElementById('delete-step-1');
var step2 = document.getElementById('delete-step-2');

btnEliminar.addEventListener('click', function() {
  step1.style.display = 'none';
  step2.style.display = 'block';
});

btnCancelar.addEventListener('click', function() {
  step1.style.display = 'block';
  step2.style.display = 'none';
});

btnConfirmar.addEventListener('click', function() {
  // Simulación — aquí iría la llamada al backend
  console.log('Cuenta eliminada');
  window.location.href = '../login/index.html';
});