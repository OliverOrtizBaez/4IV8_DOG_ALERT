// ==========================================================================
// 1. LISTAS DE OPCIONES DINÁMICAS (ORDENADAS ALFABÉTICAMENTE)
// ==========================================================================
const listaRazasForm = [
  "Mestizo / Criollo", "Labrador Retriever", "Golden Retriever", "Pastor Alemán",
  "Bulldog Francés", "Beagle", "Poodle / Caniche", "Rottweiler", "Yorkshire Terrier",
  "Chihuahua", "Husky Siberiano", "Shih Tzu", "Boxer", "Dachshund / Salchicha",
  "Doberman", "Border Collie", "Maltés", "Pug / Carlino", "Schnauzer",
  "Cocker Spaniel", "Gran Danés", "Pitbull / American Stafford", "Otro"
].sort();

const listaPelajes = [
  "Corto", "Medio", "Largo", "Rizado", "Doble capa", "Sin pelo"
].sort();

const listaOjos = [
  "Café", "Negro", "Azul", "Verde", "Ámbar", "Avellana", "Heterocromía"
].sort();

const listaColoresPelaje = [
  "Blanco", "Negro", "Café / Marrón", "Dorado / Amarillo", "Gris / Plateado",
  "Beige / Crema", "Atigrado", "Manchado (bicolor)", "Tricolor", "Merle / Moteado", "Rojizo"
].sort();

// Función que inserta las opciones en los elementos <select> correspondientes
function cargarSelectoresDinamicos() {
  const selectRaza = document.getElementById('raza');
  if (selectRaza) {
    listaRazasForm.forEach(raza => {
      const option = document.createElement('option');
      option.value = raza;
      option.textContent = raza;
      selectRaza.appendChild(option);
    });
  }

  const selectPelaje = document.getElementById('pelaje');
  if (selectPelaje) {
    listaPelajes.forEach(pelaje => {
      const option = document.createElement('option');
      option.value = pelaje;
      option.textContent = pelaje;
      selectPelaje.appendChild(option);
    });
  }

  const selectOjos = document.getElementById('colorOjos');
  if (selectOjos) {
    listaOjos.forEach(ojo => {
      const option = document.createElement('option');
      option.value = ojo;
      option.textContent = ojo;
      selectOjos.appendChild(option);
    });
  }

  const selectColorPelaje = document.getElementById('colorPelaje');
  if (selectColorPelaje) {
    listaColoresPelaje.forEach(color => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      selectColorPelaje.appendChild(option);
    });
  }
}

// ==========================================================================
// 2. LÓGICA DE CONTROL Y FLUJO DEL FORMULARIO
// ==========================================================================

// ── Estado ──
const state = {
  paso: 1,
  ruac: '',
  sexo: '',
  tamaño: '',
  collar: '',
  fotoDataUrl: '',
};

// ── Utils localStorage ──
const STORAGE_KEY = 'dog_alert_mascotas';

function getMascotas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveMascota(m) {
  const lista = getMascotas();
  lista.push(m);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// ── Validar RUAC ──
function validarRUAC(v) { return /^[A-Z0-9]{10}$/.test(v); }

// ── Actualizar UI de paso ──
function mostrarPaso(n) {
  state.paso = n;
  document.getElementById('paso1').classList.toggle('hidden', n !== 1);
  document.getElementById('paso2').classList.toggle('hidden', n !== 2);
  document.getElementById('dot1').classList.toggle('active', true);
  document.getElementById('dot2').classList.toggle('active', n === 2);
  document.getElementById('header-title').textContent = n === 1 ? 'Verificar RUAC' : 'Datos de la mascota';
  document.getElementById('header-sub').textContent   = `Paso ${n} de 2`;
}

// ── RUAC input ──
const ruacInput = document.getElementById('ruac-input');
if (ruacInput) {
  ruacInput.addEventListener('input', () => {
    ruacInput.value = ruacInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    document.getElementById('ruac-count').textContent = ruacInput.value.length + '/10';
    document.getElementById('ruac-error').classList.add('hidden');
  });
  ruacInput.addEventListener('keydown', e => { if (e.key === 'Enter') verificar(); });
}

function showRuacError(msg) {
  const el = document.getElementById('ruac-error');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  const hint = document.getElementById('ruac-hint');
  if (hint) hint.classList.add('hidden');
}

// ── Botón verificar ──
function verificar() {
  if (!ruacInput) return;
  const val = ruacInput.value.toUpperCase();
  if (!val) { showRuacError('Ingresa el RUAC de tu mascota.'); return; }
  if (!validarRUAC(val)) { showRuacError('El RUAC debe tener exactamente 10 caracteres: letras y números.'); return; }
  if (getMascotas().some(m => m.ruac === val)) {
    showRuacError('Este RUAC ya está registrado en tu cuenta.'); return;
  }

  const btn = document.getElementById('btn-verificar');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Verificando RUAC...';
  }

  setTimeout(() => {
    state.ruac = val;
    document.getElementById('ruac-ok-text').textContent = val;
    mostrarPaso(2);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = 'Verificar y continuar';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1200);
}

const btnVerificar = document.getElementById('btn-verificar');
if (btnVerificar) btnVerificar.addEventListener('click', verificar);

// ── Botón atrás ──
const btnBack = document.getElementById('btn-back');
if (btnBack) {
  btnBack.addEventListener('click', () => {
    if (state.paso === 2) { mostrarPaso(1); window.scrollTo({ top: 0 }); }
    else { window.location.href = 'registrar-mascota.html'; }
  });
}

// ── Toggle groups ──
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group    = btn.dataset.group;
    const val      = btn.dataset.value;
    const useClass = btn.dataset.class || 'active';

    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      b.classList.remove('active', 'active-blue', 'active-pink');
    });
    btn.classList.add(useClass);
    state[group] = val;
  });
});

// ── Contadores de caracteres de texto ──
const txtNombre = document.getElementById('nombre');
if (txtNombre) {
  txtNombre.addEventListener('input', function() {
    document.getElementById('nombre-count').textContent = this.value.length + '/20';
  });
}

const txtSeñas = document.getElementById('señas');
if (txtSeñas) {
  txtSeñas.addEventListener('input', function() {
    document.getElementById('señas-count').textContent = this.value.length + '/40';
  });
}

// ── Manejo de carga de Foto ──
const fotoInput   = document.getElementById('foto-input');
const btnUpload   = document.getElementById('btn-upload');
const previewWrap = document.getElementById('foto-preview-wrap');
const preview     = document.getElementById('foto-preview');

if (btnUpload && fotoInput) {
  btnUpload.addEventListener('click', () => fotoInput.click());
}

if (fotoInput) {
  fotoInput.addEventListener('change', () => {
    const file = fotoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      state.fotoDataUrl = e.target.result;
      if (preview) preview.src = e.target.result;
      if (previewWrap) previewWrap.classList.remove('hidden');
      if (btnUpload) btnUpload.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  });
}

const btnFotoRemove = document.getElementById('btn-foto-remove');
if (btnFotoRemove) {
  btnFotoRemove.addEventListener('click', () => {
    state.fotoDataUrl = '';
    if (fotoInput) fotoInput.value = '';
    if (preview) preview.src = '';
    if (previewWrap) previewWrap.classList.add('hidden');
    if (btnUpload) btnUpload.classList.remove('hidden');
  });
}

// ── Guardar datos y validación global ──
function showFormError(msg) {
  const el = document.getElementById('form-error');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideFormError() {
  const el = document.getElementById('form-error');
  if (el) el.classList.add('hidden');
}

const btnGuardar = document.getElementById('btn-guardar');
if (btnGuardar) {
  btnGuardar.addEventListener('click', () => {
    hideFormError();

    const nombre = document.getElementById('nombre').value.trim();
    const edad   = document.getElementById('edad').value;
    const peso   = document.getElementById('peso').value;
    const raza   = document.getElementById('raza').value;
    const pelaje = document.getElementById('pelaje').value;
    const colorOjos   = document.getElementById('colorOjos').value;
    const colorPelaje = document.getElementById('colorPelaje').value;
    const señas  = document.getElementById('señas').value.trim();

    if (!nombre)             { showFormError('El nombre es obligatorio.'); return; }
    if (!edad)               { showFormError('La edad es obligatoria.'); return; }
    if (Number(edad) > 31)   { showFormError('La edad máxima es 31 años.'); return; }
    if (!state.sexo)         { showFormError('Selecciona el sexo.'); return; }
    if (!raza)               { showFormError('Selecciona la raza.'); return; }
    if (!pelaje)             { showFormError('Selecciona el tipo de pelaje.'); return; }
    if (!colorOjos)          { showFormError('Selecciona el color de ojos.'); return; }
    if (!colorPelaje)        { showFormError('Selecciona el color de pelaje.'); return; }
    if (!state.tamaño)       { showFormError('Selecciona el tamaño.'); return; }
    if (!peso)               { showFormError('El peso es obligatorio.'); return; }
    if (Number(peso) > 111)  { showFormError('El peso máximo es 111 kg.'); return; }
    if (!señas)              { showFormError('Las señas particulares son obligatorias.'); return; }
    if (!state.collar)       { showFormError('Indica si tiene collar.'); return; }
    if (!state.fotoDataUrl)  { showFormError('La foto es obligatoria.'); return; }

    const nueva = {
      id:               'm' + Date.now(),
      ruac:             state.ruac,
      nombre,
      edad:             Number(edad),
      sexo:             state.sexo,
      raza,
      pelaje,
      colorOjos,
      colorPelaje,
      tamaño:           state.tamaño,
      peso:             Number(peso),
      señasParticulares: señas,
      collar:           state.collar,
      foto:             state.fotoDataUrl,
      fechaRegistro:    new Date().toLocaleDateString('es-MX'),
    };

    saveMascota(nueva);
    window.location.href = 'registrar-mascota.html';
  });
}

// ==========================================================================
// 3. INICIALIZACIÓN COMPLETA DE LA PÁGINA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Cargar las opciones del JS al HTML de forma automática
  cargarSelectoresDinamicos();
  
  // Forzar el inicio visual en el paso 1
  mostrarPaso(1);
});