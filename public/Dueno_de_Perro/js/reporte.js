// ══════════════════════════════════════════
  //  ESTADO
  // ══════════════════════════════════════════
  const state = {
    paso: 1,            // 1-4 + 'exito'
    mascota: null,      // objeto MascotaRegistrada
    fecha: '',
    resumen: '',
    ubicacion: null,    // { lat, lng, calle, colonia, alcaldia, codigoPostal, displayName }
    recompensa: 0,
  };

  // ══════════════════════════════════════════
  //  UTILS localStorage
  // ══════════════════════════════════════════
  function getMascotasLocales() {
    try { return JSON.parse(localStorage.getItem('dog_alert_mascotas') || '[]'); }
    catch { return []; }
  }
  function getReportes() {
    try {
      const raw = JSON.parse(localStorage.getItem('dog_alert_reportes') || '[]');
      const hoy = Date.now();
      return raw.filter(r => new Date(r.fechaExpiracion).getTime() > hoy);
    } catch { return []; }
  }
  function saveReporte(r) {
    const lista = getReportes();
    lista.push(r);
    localStorage.setItem('dog_alert_reportes', JSON.stringify(lista));
  }

  // ══════════════════════════════════════════
  //  PROGRESO HEADER
  // ══════════════════════════════════════════
  const PASO_LABELS = ['Mascota','Detalles','Ubicación','Recompensa'];

  function actualizarHeader(paso) {
    const sub  = document.getElementById('header-sub');
    const dots = document.getElementById('progress-dots');

    if (paso === 'exito') {
      document.getElementById('header').style.display = 'none';
      return;
    }

    const idx = paso - 1; // 0-based
    sub.textContent = `Paso ${paso} de 4`;

    if (paso === 1) {
      sub.classList.add('hidden');
      dots.classList.add('hidden');
    } else {
      sub.classList.remove('hidden');
      dots.classList.remove('hidden');
      [0,1,2,3].forEach(i => {
        const el = document.getElementById('pd' + i);
        el.className = 'pdot ' + (i < idx ? 'done' : i === idx ? 'current' : 'pending');
      });
    }
  }

  // ══════════════════════════════════════════
  //  MOSTRAR PASO
  // ══════════════════════════════════════════
  function mostrarPaso(p) {
    state.paso = p;
    ['paso1','paso2','paso3','paso4','paso-exito'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    const idPaso = p === 'exito' ? 'paso-exito' : 'paso' + p;
    document.getElementById(idPaso).classList.remove('hidden');
    actualizarHeader(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ══════════════════════════════════════════
  //  BOTÓN ATRÁS
  // ══════════════════════════════════════════
  document.getElementById('btn-back').addEventListener('click', () => {
    if (state.paso === 1) { history.back(); }
    else if (state.paso === 2) mostrarPaso(1);
    else if (state.paso === 3) mostrarPaso(2);
    else if (state.paso === 4) mostrarPaso(3);
  });

  // ══════════════════════════════════════════
  //  PASO 1 — LISTA DE MASCOTAS (consulta la API)
  // ══════════════════════════════════════════
  async function renderListaMascotas() {
    const idUsuario = localStorage.getItem('id_usuario') || sessionStorage.getItem('id_usuario');
    const container = document.getElementById('lista-mascotas');
    const reportesActivos = getReportes()
      .filter(r => r.estado === 'activo')
      .map(r => r.mascotaId);

    let mascotas = [];

    try {
      const respuesta = await fetch(`/api/mascotas/usuario/${idUsuario}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        // Normalizamos los campos para que el resto del script funcione igual
        mascotas = datos.map(m => ({
          id:     m.id_mascota,
          nombre: m.nombre,
          raza:   m.raza    || 'Sin raza',
          ruac:   m.ruac    || 'SIN RUAC',
          foto:   m.foto    || null,
          peso:   m.peso,
          sexo:   m.sexo,
          tamano: m.tamano
        }));
      } else {
        mascotas = getMascotasLocales();
      }
    } catch {
      console.warn("Cargando desde el almacenamiento local del navegador.");
      mascotas = getMascotasLocales();
    }

    if (mascotas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="32" height="32" fill="none" stroke="#cbd5e1" stroke-width="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <p class="empty-title">No tienes mascotas registradas</p>
          <p class="empty-desc">Primero debes registrar a tu mascota para poder crear un reporte.</p>
          <a href="./registrar_mascota.html" class="btn-black" style="width:auto;padding:0 24px;text-decoration:none;">
            Registrar mascota
          </a>
        </div>`;
      return;
    }

    container.innerHTML = mascotas.map(m => {
      const yaReportada = reportesActivos.includes(m.id);
      return `
        <button class="pet-row" data-id="${m.id}" ${yaReportada ? 'disabled' : ''}
          style="margin-bottom:10px;">
          <div class="pet-thumb">
            ${m.foto
              ? `<img src="${m.foto}" alt="${m.nombre}" />`
              : `<svg width="28" height="28" fill="none" stroke="#cbd5e1" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`}
          </div>
          <div class="pet-info">
            <p class="pet-nombre">${m.nombre}</p>
            <p class="pet-raza">${m.raza}</p>
            <p class="pet-ruac">${m.ruac}</p>
          </div>
          ${yaReportada
            ? `<span class="badge-reportada">Ya reportada</span>`
            : `<svg width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
               </svg>`}
        </button>`;
    }).join('');

    // Eventos click
    container.querySelectorAll('.pet-row:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        state.mascota = mascotas.find(m => m.id === id);
        irAPaso2();
      });
    });
  }

  function irAPaso2() {
    const m = state.mascota;
    // Chip
    const thumb = document.getElementById('chip-thumb');
    thumb.innerHTML = m.foto
      ? `<img src="${m.foto}" alt="${m.nombre}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<svg width="20" height="20" fill="none" stroke="#cbd5e1" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;
    document.getElementById('chip-nombre').textContent = m.nombre;
    document.getElementById('chip-sub').textContent    = `${m.raza} · ${m.ruac}`;
    mostrarPaso(2);
  }

  // ══════════════════════════════════════════
  //  PASO 2 — FECHA + RESUMEN
  // ══════════════════════════════════════════

  // Configurar límites de fecha
  (function() {
    const hoy = new Date();
    const max = hoy.toISOString().split('T')[0];
    const haceUnAnio = new Date();
    haceUnAnio.setFullYear(haceUnAnio.getFullYear() - 1);
    const min = haceUnAnio.toISOString().split('T')[0];
    const inp = document.getElementById('fecha');
    inp.max = max;
    inp.min = min;
  })();

  document.getElementById('resumen').addEventListener('input', function() {
    document.getElementById('resumen-count').textContent = this.value.length + '/100';
  });

  document.getElementById('btn-p2').addEventListener('click', () => {
    const fecha   = document.getElementById('fecha').value;
    const resumen = document.getElementById('resumen').value.trim();
    const errEl   = document.getElementById('error-p2');
    const errMsg  = document.getElementById('error-p2-msg');

    errEl.classList.add('hidden');

    if (!fecha)   { errMsg.textContent = 'Selecciona la fecha de los hechos.'; errEl.classList.remove('hidden'); return; }
    const f = new Date(fecha);
    const hoy = new Date(); hoy.setHours(23,59,59,999);
    const haceUnAnio = new Date(); haceUnAnio.setFullYear(haceUnAnio.getFullYear()-1);
    if (f > hoy)        { errMsg.textContent = 'La fecha no puede ser futura.'; errEl.classList.remove('hidden'); return; }
    if (f < haceUnAnio) { errMsg.textContent = 'La fecha no puede ser mayor a un año atrás.'; errEl.classList.remove('hidden'); return; }
    if (!resumen)       { errMsg.textContent = 'Escribe un resumen de los hechos.'; errEl.classList.remove('hidden'); return; }

    state.fecha   = fecha;
    state.resumen = resumen;
    mostrarPaso(3);
    inicializarMapa();
  });

  // ══════════════════════════════════════════
  //  PASO 3 — MAPA LEAFLET
  // ══════════════════════════════════════════
  let mapaIniciado = false;
  let leafletMap, marker;

  const CDMX_CENTER = [19.432608, -99.133208];
  const CDMX_BOUNDS = L.latLngBounds([19.048, -99.364], [19.593, -98.940]);

  function inicializarMapa() {
    if (mapaIniciado) return;
    mapaIniciado = true;

    leafletMap = L.map('mapa', {
      center: CDMX_CENTER,
      zoom: 13,
      maxBounds: CDMX_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(leafletMap);

    leafletMap.on('click', async (e) => {
      if (!CDMX_BOUNDS.contains(e.latlng)) {
        mostrarToastMapa(); return;
      }
      colocarPin(e.latlng.lat, e.latlng.lng);
      await geocodificar(e.latlng.lat, e.latlng.lng);
    });

    // Si ya hay ubicación guardada, restaurar
    if (state.ubicacion) {
      const ll = L.latLng(state.ubicacion.lat, state.ubicacion.lng);
      marker = L.marker(ll).addTo(leafletMap);
      leafletMap.setView(ll, 16);
      mostrarDireccion(state.ubicacion);
    }
  }

  function colocarPin(lat, lng) {
    const ll = L.latLng(lat, lng);
    if (marker) marker.setLatLng(ll);
    else marker = L.marker(ll).addTo(leafletMap);
  }

  async function geocodificar(lat, lng) {
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`, { headers: { 'Accept-Language': 'es' } });
      const data = await res.json();
      const addr = data.address || {};
      const u = {
        lat, lng,
        calle:        addr.road || addr.pedestrian || addr.footway || 'Sin calle',
        colonia:      addr.suburb || addr.neighbourhood || addr.quarter || addr.village || 'Sin colonia',
        alcaldia:     addr.city_district || addr.borough || addr.county || 'Sin alcaldía',
        codigoPostal: addr.postcode || '',
        displayName:  data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      };
      state.ubicacion = u;
      mostrarDireccion(u);
    } catch { /* silencioso */ }
  }

  function mostrarDireccion(u) {
    document.getElementById('dir-calle').textContent    = u.calle;
    document.getElementById('dir-colonia').textContent  = u.colonia;
    document.getElementById('dir-alcaldia').textContent = u.alcaldia;
    document.getElementById('dir-cp').textContent       = u.codigoPostal || '—';
    document.getElementById('dir-card').classList.remove('hidden');
  }

  function mostrarToastMapa() {
    const t = document.getElementById('toast-mapa');
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
  }

  // Búsqueda
  async function buscarDireccion() {
    const q = document.getElementById('map-search').value.trim();
    if (!q) return;
    const btn = document.getElementById('btn-buscar');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;"></div> Buscando...';

    try {
      const encoded = encodeURIComponent(q + ', Ciudad de México');
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=1&bounded=1&viewbox=-99.364,19.048,-98.940,19.593`, { headers: { 'Accept-Language': 'es' } });
      const data = await res.json();
      if (!data.length) { mostrarToastMapa(); return; }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      const ll  = L.latLng(lat, lng);
      if (!CDMX_BOUNDS.contains(ll)) { mostrarToastMapa(); return; }

      leafletMap.flyTo(ll, 16);
      colocarPin(lat, lng);
      await geocodificar(lat, lng);
    } catch { mostrarToastMapa(); }
    finally {
      btn.disabled = false;
      btn.innerHTML = 'Buscar';
    }
  }

  document.getElementById('btn-buscar').addEventListener('click', buscarDireccion);
  document.getElementById('map-search').addEventListener('keydown', e => { if (e.key === 'Enter') buscarDireccion(); });

  document.getElementById('btn-p3').addEventListener('click', () => {
    if (!state.ubicacion) {
      document.getElementById('error-p3').classList.remove('hidden'); return;
    }
    document.getElementById('error-p3').classList.add('hidden');
    rellenarResumen();
    mostrarPaso(4);
  });

  // ══════════════════════════════════════════
  //  PASO 4 — RECOMPENSA
  // ══════════════════════════════════════════
  function formatMXN(v) { return '$' + Number(v).toLocaleString('es-MX'); }
  function formatFecha(iso) {
    return new Date(iso).toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' });
  }

  function setRecompensa(val) {
    val = Math.min(10000, Math.max(0, Number(val) || 0));
    state.recompensa = val;
    document.getElementById('monto-display').textContent  = formatMXN(val);
    document.getElementById('slider-recompensa').value    = val;
    document.getElementById('input-recompensa').value     = val;
    document.getElementById('r-recompensa').textContent   = formatMXN(val) + ' MXN';
    document.querySelectorAll('.quick-btn').forEach(b => {
      b.classList.toggle('active', Number(b.dataset.val) === val);
    });
  }

  document.getElementById('slider-recompensa').addEventListener('input', function() { setRecompensa(this.value); });
  document.getElementById('input-recompensa').addEventListener('input', function() { setRecompensa(this.value); });
  document.querySelectorAll('.quick-btn').forEach(b => {
    b.addEventListener('click', () => setRecompensa(b.dataset.val));
  });

  function rellenarResumen() {
    const u = state.ubicacion;
    document.getElementById('r-mascota').textContent   = state.mascota?.nombre || '';
    document.getElementById('r-fecha').textContent     = state.fecha ? formatFecha(state.fecha) : '—';
    document.getElementById('r-ubicacion').textContent = u ? `${u.colonia}, ${u.alcaldia}` : '—';
    document.getElementById('r-recompensa').textContent= formatMXN(state.recompensa) + ' MXN';
  }

  document.getElementById('btn-p4').addEventListener('click', publicar);

  function publicar() {
    const ahora = new Date();
    const exp   = new Date();
    exp.setDate(exp.getDate() + 60);

    const r = {
      id:              'r' + Date.now(),
      mascotaId:       state.mascota.id,
      mascotaNombre:   state.mascota.nombre,
      mascotaFoto:     state.mascota.foto,
      mascotaRaza:     state.mascota.raza,
      ruac:            state.mascota.ruac,
      fechaHechos:     state.fecha,
      resumen:         state.resumen,
      ubicacion:       state.ubicacion,
      recompensa:      state.recompensa,
      fechaCreacion:   ahora.toISOString(),
      fechaExpiracion: exp.toISOString(),
      estado:          'activo',
    };
    saveReporte(r);

    // Éxito
    document.getElementById('exito-desc').innerHTML =
      `El reporte de <strong>${r.mascotaNombre}</strong> fue publicado con éxito. Estará activo por <strong>60 días</strong>.`;
    document.getElementById('ex-ruac').textContent      = r.ruac;
    document.getElementById('ex-ubi').textContent       = `${r.ubicacion.colonia}, ${r.ubicacion.alcaldia}`;
    document.getElementById('ex-recompensa').textContent= formatMXN(r.recompensa) + ' MXN';
    document.getElementById('ex-expira').textContent    = formatFecha(r.fechaExpiracion);

    mostrarPaso('exito');
  }

  // ══════════════════════════════════════════
  //  INICIO
  // ══════════════════════════════════════════
  renderListaMascotas();
  mostrarPaso(1);
  setRecompensa(0);