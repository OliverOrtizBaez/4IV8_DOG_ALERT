/* ════════════════════════════════════════════
   Estado global
═══════════════════════════════════════════════ */
const state = {
  paso: 1,
  sinNombre: false,
  nombre: '',
  sexo: '',
  tamaño: '',
  collar: '',
  fotoDataUrl: '',
  ubicacion: null,   // { lat, lng, calle, colonia, alcaldia, codigoPostal, displayName }
  noAplica: false,
  recompensa: 0,
  folioGuardado: '',
};

const PASOS = [
  { label: 'Mascota',    icon: '🐾' },
  { label: 'Lugar',      icon: '📍' },
  { label: 'Recompensa', icon: '💰' },
];

/* ════════════════════════════════════════════
   Step bar
═══════════════════════════════════════════════ */
function renderStepBar() {
  const track = document.getElementById('step-track');
  track.innerHTML = PASOS.map((p, i) => {
    const n = i + 1;
    const done    = n < state.paso;
    const current = n === state.paso;
    const circleClass = done ? 'done' : current ? 'current' : 'pending';
    const labelClass  = current ? 'current' : 'other';
    const circleContent = done
      ? `<svg width="13" height="13" fill="none" stroke="#fff" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`
      : `${n}`;
    const line = i < PASOS.length - 1
      ? `<div class="step-line ${done ? 'done' : 'pending'}"></div>`
      : '';
    return `
      <div class="step-item">
        <div class="step-circle ${circleClass}">${circleContent}</div>
        <span class="step-label ${labelClass}">${p.label}</span>
      </div>${line}`;
  }).join('');
}

/* ════════════════════════════════════════════
   Navegación entre pasos
═══════════════════════════════════════════════ */
function setPaso(n) {
  state.paso = n;
  document.getElementById('paso-1').classList.toggle('hidden', n !== 1);
  document.getElementById('paso-2').classList.toggle('hidden', n !== 2);
  document.getElementById('paso-3').classList.toggle('hidden', n !== 3);
  renderStepBar();
  if(n === 2) { setTimeout(initMap, 100); }
  if(n === 3) { actualizarResumen(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════════
   Toggle helpers
═══════════════════════════════════════════════ */
function setToggle(grp, val) {
  state[grp] = val;
  document.querySelectorAll(`[data-grp="${grp}"]`).forEach(b => {
    b.classList.toggle('active', b.dataset.val === val);
  });
}

/* ════════════════════════════════════════════
   Sin nombre
═══════════════════════════════════════════════ */
function toggleSinNombre() {
  state.sinNombre = !state.sinNombre;
  document.getElementById('cb-sin-nombre').classList.toggle('checked', state.sinNombre);
  const input = document.getElementById('nombre');
  input.disabled = state.sinNombre;
  if(state.sinNombre) { input.value = ''; state.nombre = ''; document.getElementById('nombre-len').textContent = '0'; }
}

document.getElementById('nombre').addEventListener('input', function() {
  state.nombre = this.value;
  document.getElementById('nombre-len').textContent = this.value.length;
});
document.getElementById('señas').addEventListener('input', function() {
  document.getElementById('señas-len').textContent = this.value.length;
});
document.getElementById('resumen').addEventListener('input', function() {
  document.getElementById('resumen-len').textContent = this.value.length;
});

/* ════════════════════════════════════════════
   Foto
═══════════════════════════════════════════════ */
document.getElementById('foto-input').addEventListener('change', function() {
  const file = this.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    state.fotoDataUrl = e.target.result;
    renderFotoZone();
  };
  reader.readAsDataURL(file);
});

function renderFotoZone() {
  const zone = document.getElementById('foto-zone');
  if(state.fotoDataUrl) {
    zone.innerHTML = `
      <div class="foto-preview">
        <img src="${state.fotoDataUrl}" alt="Vista previa" />
        <button class="btn-remove-foto" onclick="removeFoto()">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>`;
  } else {
    zone.innerHTML = `
      <div class="upload-zone" onclick="document.getElementById('foto-input').click()">
        <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p>Subir foto</p><small>JPG, PNG — máx. 10 MB</small>
      </div>`;
  }
}

function removeFoto() {
  state.fotoDataUrl = '';
  document.getElementById('foto-input').value = '';
  renderFotoZone();
}

/* ════════════════════════════════════════════
   Mapa Leaflet
═══════════════════════════════════════════════ */
let map = null, marker = null;
const CDMX_CENTER = [19.42, -99.13];
const CDMX_BOUNDS = L.latLngBounds([19.048, -99.364], [19.593, -98.940]);

function initMap() {
  if(map) { map.invalidateSize(); return; }
  map = L.map('map', { maxBounds: CDMX_BOUNDS, maxBoundsViscosity: 1 })
    .setView(CDMX_CENTER, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const icon = L.divIcon({
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:#0f172a;border:3px solid #fff;transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
    iconSize: [28, 28], iconAnchor: [14, 28], className: ''
  });

  map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    if(!CDMX_BOUNDS.contains(e.latlng)) return;
    if(marker) marker.setLatLng(e.latlng);
    else marker = L.marker(e.latlng, { icon }).addTo(map);
    geocodificar(lat, lng);
  });
}

async function geocodificar(lat, lng) {
  const addrEl = document.getElementById('map-addr');
  addrEl.textContent = 'Obteniendo dirección...';
  addrEl.classList.add('visible');
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`, {
      headers: { 'Accept-Language': 'es' }
    });
    const d = await res.json();
    const a = d.address || {};
    state.ubicacion = {
      lat, lng,
      calle:        a.road || a.pedestrian || a.footway || 'Calle desconocida',
      colonia:      a.suburb || a.neighbourhood || a.quarter || a.village || 'Colonia desconocida',
      alcaldia:     a.city_district || a.county || a.municipality || 'Alcaldía desconocida',
      codigoPostal: a.postcode || '',
      displayName:  d.display_name || '',
    };
    addrEl.textContent = `${state.ubicacion.calle}, ${state.ubicacion.colonia}, ${state.ubicacion.alcaldia}`;
  } catch {
    state.ubicacion = { lat, lng, calle: 'Dirección no disponible', colonia: '', alcaldia: '', codigoPostal: '', displayName: '' };
    addrEl.textContent = 'Ubicación marcada (sin dirección)';
  }
}

/* ════════════════════════════════════════════
   No aplica / Recompensa
═══════════════════════════════════════════════ */
function toggleNoAplica() {
  state.noAplica = !state.noAplica;
  document.getElementById('cb-no-aplica').classList.toggle('checked', state.noAplica);
  document.getElementById('reward-section').classList.toggle('hidden', state.noAplica);
  actualizarResumen();
}

function setReward(val) {
  const v = Math.min(10000, Math.max(0, Number(val) || 0));
  state.recompensa = v;
  document.getElementById('reward-range').value = v;
  document.getElementById('reward-num').value   = v;
  document.getElementById('reward-display').textContent = `$${v.toLocaleString('es-MX')}`;
  document.querySelectorAll('.quick-btn').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.r) === v);
  });
  actualizarResumen();
}

/* ════════════════════════════════════════════
   Resumen (paso 3)
═══════════════════════════════════════════════ */
function actualizarResumen() {
  const nombre = state.sinNombre ? 'Sin nombre' : (state.nombre || '—');
  const raza   = document.getElementById('raza').value || '—';
  document.getElementById('sum-mascota').textContent  = `${nombre} · ${raza}`;
  document.getElementById('sum-sextam').textContent   = `${state.sexo || '—'} · ${state.tamaño || '—'}`;
  document.getElementById('sum-lugar').textContent    = state.ubicacion
    ? `${state.ubicacion.calle}, ${state.ubicacion.colonia}` : '—';
  document.getElementById('sum-recompensa').textContent = state.noAplica
    ? 'No aplica' : `$${state.recompensa.toLocaleString('es-MX')} MXN`;

  const wrap = document.getElementById('sum-img-wrap');
  const img  = document.getElementById('sum-img');
  if(state.fotoDataUrl) {
    img.src = state.fotoDataUrl;
    wrap.classList.add('visible');
  } else {
    wrap.classList.remove('visible');
  }
}

/* ════════════════════════════════════════════
   Validaciones y navegación
═══════════════════════════════════════════════ */
function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 4000);
}

function irPaso2() {
  const sinNombre = state.sinNombre;
  const nombre    = document.getElementById('nombre').value.trim();
  if(!sinNombre && !nombre) return showErr('err-1', 'Ingresa un nombre o marca "Sin nombre visible"');
  if(!state.sexo)           return showErr('err-1', 'Selecciona el sexo');
  if(!document.getElementById('raza').value)         return showErr('err-1', 'Selecciona una raza');
  if(!document.getElementById('pelaje').value)       return showErr('err-1', 'Selecciona el tipo de pelaje');
  if(!document.getElementById('color-pelaje').value) return showErr('err-1', 'Selecciona el color de pelaje');
  if(!document.getElementById('color-ojos').value)   return showErr('err-1', 'Selecciona el color de ojos');
  if(!state.tamaño)         return showErr('err-1', 'Selecciona el tamaño');
  state.nombre = nombre;
  setPaso(2);
}

function irPaso3() {
  if(!state.ubicacion) return showErr('err-2', 'Selecciona la ubicación en el mapa');
  const resumen = document.getElementById('resumen').value.trim();
  if(!resumen)          return showErr('err-2', 'Escribe un breve resumen de la situación');
  setPaso(3);
}

/* ════════════════════════════════════════════
   Guardar en localStorage y mostrar éxito
═══════════════════════════════════════════════ */
function generarFolio() {
  return 'SR-' + Date.now().toString(36).toUpperCase().slice(-6);
}
function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
}

function enviar() {
  const ahora = new Date();
  const exp   = new Date(ahora);
  exp.setDate(exp.getDate() + 60);

  const folio = generarFolio();
  const reporte = {
    id:                folio,
    foto:              state.fotoDataUrl,
    nombre:            state.sinNombre ? null : state.nombre,
    sexo:              state.sexo,
    raza:              document.getElementById('raza').value,
    pelaje:            document.getElementById('pelaje').value,
    colorPelaje:       document.getElementById('color-pelaje').value,
    colorOjos:         document.getElementById('color-ojos').value,
    tamaño:            state.tamaño,
    peso:              document.getElementById('peso').value ? parseFloat(document.getElementById('peso').value) : null,
    señasParticulares: document.getElementById('señas').value.trim(),
    collar:            state.collar === 'si' ? true : state.collar === 'no' ? false : null,
    resumen:           document.getElementById('resumen').value.trim(),
    ubicacion:         state.ubicacion,
    recompensa:        state.noAplica ? null : state.recompensa,
    fechaCreacion:     ahora.toISOString(),
    fechaExpiracion:   exp.toISOString(),
    estado:            'activo',
  };

  // Guardar
  const KEY = 'dog_alert_sin_ruac';
  try {
    const lista = JSON.parse(localStorage.getItem(KEY) || '[]');
    lista.push(reporte);
    localStorage.setItem(KEY, JSON.stringify(lista));
  } catch(e) {}

  state.folioGuardado = folio;
  mostrarExito(reporte, exp);
}

function mostrarExito(r, exp) {
  document.getElementById('screens').classList.add('hidden');
  document.getElementById('exito').classList.remove('hidden');

  // Avatar
  const avatarWrap = document.getElementById('success-avatar-wrap');
  if(r.foto) {
    avatarWrap.innerHTML = `
      <div class="success-avatar">
        <img src="${r.foto}" alt="Mascota" />
        <div class="check-badge">
          <svg width="12" height="12" fill="none" stroke="#fff" stroke-width="3" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>`;
  } else {
    avatarWrap.innerHTML = `
      <div class="success-icon-plain">
        <svg width="32" height="32" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>`;
  }

  document.getElementById('suc-folio').textContent    = r.id;
  document.getElementById('suc-mascota').textContent  = `${r.nombre ?? 'Sin nombre'} · ${r.raza}`;
  document.getElementById('suc-lugar').textContent    = `${r.ubicacion.calle}, ${r.ubicacion.colonia}`;
  document.getElementById('suc-expira').textContent   = formatFecha(exp.toISOString());
  document.getElementById('suc-recompensa').textContent = r.recompensa === null
    ? 'No aplica' : `$${r.recompensa.toLocaleString('es-MX')} MXN`;

  window.scrollTo({ top: 0 });
}

/* ════════════════════════════════════════════
   Copiar folio
═══════════════════════════════════════════════ */
function copiarFolio() {
  const folio = document.getElementById('suc-folio').textContent;
  navigator.clipboard.writeText(folio).then(() => {
    const lbl = document.getElementById('copied-label');
    lbl.classList.remove('hidden');
    setTimeout(() => lbl.classList.add('hidden'), 2000);
  });
}

/* ════════════════════════════════════════════
   Botón atrás
═══════════════════════════════════════════════ */
document.getElementById('btn-back').addEventListener('click', () => {
  if(state.paso === 1) history.back();
  else setPaso(state.paso - 1);
});

/* ════════════════════════════════════════════
   Init
═══════════════════════════════════════════════ */
renderStepBar();