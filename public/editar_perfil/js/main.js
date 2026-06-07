// ─── SESIÓN ────────────────────────────────────────────────────────────────────
const API = '/api'; 

function getSession() {
  const raw = localStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}

function saveSession(data) {
  const session = getSession();
  localStorage.setItem('usuario', JSON.stringify({ ...session, ...data }));
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
  if (!session) {
    window.location.href = '../login/index.html';
    return;
  }

  document.getElementById('nombre').value = session.nombre_completo || '';
  document.getElementById('email').value  = session.correo || '';

  // Validar que la foto exista y no sea el texto "undefined"
  if (session.foto_url && session.foto_url !== 'undefined' && session.foto_url !== 'null') {
    avatarImg.src = session.foto_url;
    avatarImg.style.display = 'block';
    avatarPlaceholder.style.display = 'none';

    // Evita el error 404 en consola si la ruta de la imagen en BD está rota
    avatarImg.onerror = function() {
      avatarImg.style.display = 'none';
      avatarPlaceholder.style.display = 'block';
    };
  } else {
    avatarImg.style.display = 'none';
    avatarPlaceholder.style.display = 'block';
  }
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
    avatarImg.src = e.target.result;
    avatarImg.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// ─── GUARDAR CAMBIOS (TEXTO Y FOTO) ───────────────────────────────────────────
btnGuardar.addEventListener('click', async function (e) {
  e.preventDefault();

  var nombre     = document.getElementById('nombre').value.trim();
  var passActual = document.getElementById('pass-actual').value;
  var passNueva  = document.getElementById('pass-nueva').value;
  var passConf   = document.getElementById('pass-confirmar').value;

  msgError.textContent = '';
  msgOk.textContent    = '';

  if (!nombre) {
    msgError.textContent = 'El nombre es obligatorio.';
    return;
  }

  if (passNueva || passConf) {
    if (!passActual) {
      msgError.textContent = 'Debes ingresar tu contraseña actual para cambiarla.';
      return;
    }
    if (passNueva !== passConf) {
      msgError.textContent = 'Las contraseñas nuevas no coinciden.';
      return;
    }
  }

  var session = getSession();
  
  // Extrae el ID y verifica que no sea una cadena de texto rota
  var miId = session ? (session.id_persona || session.id || session.id_usuario) : null;
  if (miId === 'undefined' || miId === 'null') {
      miId = null; 
  }

  if (!session || !miId) {
    msgError.textContent = 'Error de sesión. Por favor, cierra sesión y vuelve a entrar.';
    return;
  }

  btnGuardar.disabled = true;

  console.log("🚀 Iniciando guardado de perfil...");
  console.log("👉 ID a enviar:", miId);

  try {
    // 1. Enviar datos de texto
    var payload = {
      nombre_completo: nombre,
      contrasena_actual: passActual,
      contrasena_nueva: passNueva
    };

    const urlTexto = API + '/personas/' + miId;
    console.log("🌐 URL de actualización de datos:", urlTexto);

    var resDatos = await fetch(urlTexto, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resDatos.ok) {
      var dataErr = await resDatos.json();
      throw new Error(dataErr.mensaje || dataErr.error || 'Error al actualizar los datos.');
    }

    saveSession({ nombre_completo: nombre });

    // 2. Enviar la foto de perfil (Solo si se seleccionó una)
    if (archivoFotoSeleccionado) {
      console.log("📸 Detectada nueva foto, procesando subida...");
      var formData = new FormData();
      formData.append('foto', archivoFotoSeleccionado);

      const urlFoto = API + '/personas/' + miId + '/foto';
      console.log("🌐 URL de actualización de foto:", urlFoto);

      var resFoto = await fetch(urlFoto, {
        method: 'PUT',
        body: formData 
      });

      if (!resFoto.ok) {
        var fotoErr = await resFoto.json();
        throw new Error(fotoErr.mensaje || fotoErr.error || 'Error al subir la foto.');
      }

      var fotoData = await resFoto.json();
      saveSession({ foto_url: fotoData.foto_url });
      console.log("✅ Foto guardada correctamente:", fotoData.foto_url);
    }

    msgOk.textContent = 'Perfil actualizado correctamente.';
    
    document.getElementById('pass-actual').value = '';
    document.getElementById('pass-nueva').value = '';
    document.getElementById('pass-confirmar').value = '';
    
    archivoFotoSeleccionado = null;

  } catch (err) {
    console.error("❌ Error durante el guardado:", err);
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
  var miId = session ? (session.id_persona || session.id || session.id_usuario) : null;
  if (miId === 'undefined' || miId === 'null') miId = null;

  if (!session || !miId) {
    msgError.textContent = 'Error de sesión al intentar eliminar.';
    return;
  }

  btnConfirmar.disabled = true;

  try {
    var res = await fetch(API + '/personas/' + miId, {
      method: 'DELETE'
    });

    if (!res.ok) {
      var data = await res.json();
      msgError.textContent = data.mensaje || data.error || 'No se pudo eliminar la cuenta.';
      btnConfirmar.disabled = false;
      return;
    }

    localStorage.removeItem('usuario');
    window.location.href = '../login/index.html';

  } catch (err) {
    console.error(err);
    msgError.textContent = 'Error al conectar con el servidor.';
    btnConfirmar.disabled = false;
  }
});