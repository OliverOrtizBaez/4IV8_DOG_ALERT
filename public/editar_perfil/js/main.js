// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
// ⚠️ Cambia el puerto si tu backend no corre en 3000
const API = 'http://localhost:3000/api';
 
// ─── SESIÓN ───────────────────────────────────────────────────────────────────
// ✅ Se agregaron las funciones faltantes para manejar el localStorage
function getSession() {
  try {
    var userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("Error leyendo la sesión:", e);
    return null;
  }
}

function saveSession(nuevosDatos) {
  var session = getSession() || {};
  var actualizada = Object.assign({}, session, nuevosDatos); // Fusiona los datos viejos con los nuevos
  localStorage.setItem('usuario', JSON.stringify(actualizada));
}
 
// ─── REFERENCIAS DOM ──────────────────────────────────────────────────────────
var btnCamara         = document.getElementById('btn-camara');
var inputFoto         = document.getElementById('input-foto');
var avatarImg         = document.getElementById('avatar-img');
var avatarPlaceholder = document.getElementById('avatar-placeholder');
var form              = document.getElementById('perfil-form');
var btnGuardar        = document.getElementById('btn-guardar');
var msgError          = document.getElementById('msg-error');
var msgOk             = document.getElementById('msg-ok');
 
// ─── CARGAR DATOS AL ENTRAR ───────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function () {
  var session = getSession();
 
  // Sin sesión → regresar al login
  // ✅ Corregida la ruta de '.../login' a '../login'
  if (!session || !session.id_persona) {
    window.location.href = '../login/login.html';
    return;
  }
 
  document.getElementById('nombre').value = session.nombre_completo || '';
  document.getElementById('email').value  = session.correo || '';
 
  if (session.foto_url && session.foto_url !== 'undefined' && session.foto_url !== 'null') {
    avatarImg.src = session.foto_url;
    avatarImg.style.display         = 'block';
    avatarPlaceholder.style.display = 'none';
 
    avatarImg.onerror = function () {
      avatarImg.style.display         = 'none';
      avatarPlaceholder.style.display = 'block';
    };
  }
});
 
// ─── TOGGLE MOSTRAR/OCULTAR CONTRASEÑA ───────────────────────────────────────
document.querySelectorAll('.toggle-pass').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var input  = document.getElementById(btn.getAttribute('data-target'));
    var eyeOn  = btn.querySelector('.icon-eye');
    var eyeOff = btn.querySelector('.icon-eye-off');
 
    if (input.type === 'password') {
      input.type            = 'text';
      eyeOn.style.display   = 'none';
      eyeOff.style.display  = 'block';
    } else {
      input.type            = 'password';
      eyeOn.style.display   = 'block';
      eyeOff.style.display  = 'none';
    }
  });
});
 
// ─── FOTO DE PERFIL (VISTA PREVIA) ───────────────────────────────────────────
var archivoFotoSeleccionado = null;
 
btnCamara.addEventListener('click', function () {
  inputFoto.click();
});
 
inputFoto.addEventListener('change', function () {
  var file = this.files[0];
  if (!file) return;
 
  archivoFotoSeleccionado = file;
 
  var reader = new FileReader();
  reader.onload = function (e) {
    avatarImg.src                   = e.target.result;
    avatarImg.style.display         = 'block';
    avatarPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});
 
// ─── GUARDAR CAMBIOS ──────────────────────────────────────────────────────────
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  msgError.textContent = '';
  msgOk.textContent    = '';
 
  var session = getSession();
  if (!session || !session.id_persona) {
    msgError.textContent = 'Error de sesión. Por favor, cierra sesión y vuelve a entrar.';
    return;
  }
 
  var nombre     = document.getElementById('nombre').value.trim();
  var passActual = document.getElementById('pass-actual').value;
  var passNueva  = document.getElementById('pass-nueva').value;
  var passConf   = document.getElementById('pass-confirm').value;
 
  // ── Validaciones ─────────────────────────────────────────────────────────
  if (!nombre) {
    msgError.textContent = 'El nombre es obligatorio.';
    return;
  }
 
  if (passNueva || passConf || passActual) {
    if (!passActual) {
      msgError.textContent = 'Ingresa tu contraseña actual para cambiarla.';
      return;
    }
    if (passNueva.length < 8) {
      msgError.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (passNueva !== passConf) {
      msgError.textContent = 'Las contraseñas nuevas no coinciden.';
      return;
    }
  }
 
  btnGuardar.disabled      = true;
  btnGuardar.textContent   = 'Guardando…';
 
  try {
    // ── 1. Actualizar nombre y contraseña ─────────────────────────────────
    var payload = { nombre_completo: nombre };
    if (passActual && passNueva) {
      payload.contrasena_actual = passActual;
      payload.contrasena_nueva  = passNueva;
    }
 
    var resDatos = await fetch(API + '/personas/' + session.id_persona, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
 
    var dataDatos = await resDatos.json();
    if (!resDatos.ok) {
      throw new Error(dataDatos.mensaje || dataDatos.error || 'Error al actualizar los datos.');
    }
 
    saveSession({ nombre_completo: nombre });
 
    // ── 2. Subir foto si se seleccionó ────────────────────────────────────
    if (archivoFotoSeleccionado) {
      var formData = new FormData();
      formData.append('foto', archivoFotoSeleccionado);
 
      var resFoto = await fetch(API + '/personas/' + session.id_persona + '/foto', {
        method: 'PUT',
        body:   formData
      });
 
      var dataFoto = await resFoto.json();
      if (!resFoto.ok) {
        throw new Error(dataFoto.mensaje || dataFoto.error || 'Error al subir la foto.');
      }
 
      saveSession({ foto_url: dataFoto.foto_url });
      archivoFotoSeleccionado = null;
    }
 
    // ── 3. UI de éxito ────────────────────────────────────────────────────
    msgOk.textContent = '¡Perfil actualizado correctamente!';
    document.getElementById('pass-actual').value  = '';
    document.getElementById('pass-nueva').value   = '';
    document.getElementById('pass-confirm').value = '';
 
    btnGuardar.classList.add('ok');
    btnGuardar.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">' +
      '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>' +
      '<polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
      ' ✓ ¡Guardado!';
 
    setTimeout(function () {
      btnGuardar.classList.remove('ok');
      btnGuardar.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">' +
        '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>' +
        '<polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
        ' Guardar cambios';
      msgOk.textContent = '';
    }, 3000);
 
  } catch (err) {
    console.error('Error al guardar:', err);
    msgError.textContent = err.message || 'No se pudo conectar con el servidor.';
  } finally {
    btnGuardar.disabled = false;
  }
});
 
// ─── ELIMINAR CUENTA ──────────────────────────────────────────────────────────
var btnEliminar  = document.getElementById('btn-eliminar');
var btnCancelar  = document.getElementById('btn-cancelar');
var btnConfirmar = document.getElementById('btn-confirmar-delete');
var step1        = document.getElementById('delete-step-1');
var step2        = document.getElementById('delete-step-2');
 
btnEliminar.addEventListener('click', function () {
  step1.style.display = 'none';
  step2.style.display = 'block';
});
 
btnCancelar.addEventListener('click', function () {
  step1.style.display = 'block';
  step2.style.display = 'none';
});
 
btnConfirmar.addEventListener('click', async function () {
  var session = getSession();
  if (!session || !session.id_persona) {
    msgError.textContent = 'Error de sesión al intentar eliminar.';
    return;
  }
 
  btnConfirmar.disabled = true;
 
  try {
    var res = await fetch(API + '/personas/' + session.id_persona, {
      method: 'DELETE'
    });
 
    if (!res.ok) {
      var data = await res.json();
      msgError.textContent  = data.mensaje || data.error || 'No se pudo eliminar la cuenta.';
      btnConfirmar.disabled = false;
      return;
    }
 
    localStorage.removeItem('usuario');
    // ✅ Corregida la ruta también aquí
    window.location.href = '../login/login.html';
 
  } catch (err) {
    console.error(err);
    msgError.textContent  = 'Error al conectar con el servidor.';
    btnConfirmar.disabled = false;
  }
});