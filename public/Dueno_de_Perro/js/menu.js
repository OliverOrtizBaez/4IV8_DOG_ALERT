document.addEventListener('DOMContentLoaded', async () => {

  // ══════════════════════════════════════════
  //  1. SESIÓN
  // ══════════════════════════════════════════
  const idUsuario     = localStorage.getItem('id_usuario')     || sessionStorage.getItem('id_usuario');
  const nombreUsuario = localStorage.getItem('nombre_usuario') || sessionStorage.getItem('nombre_usuario');

  if (!idUsuario || !nombreUsuario) {
    console.warn("Sin credenciales. Redirigiendo...");
    window.location.href = '/Sin_Usuario/menu_sinusuario.html';
    return;
  }

  const navUserName = document.querySelector('.nav-user-name');
  if (navUserName) navUserName.textContent = nombreUsuario;

  const btnLogout = document.querySelector('.nav-item.cerrar');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/Sin_Usuario/menu_sinusuario.html';
    });
  }

  // ══════════════════════════════════════════
  //  2. ESTADO GLOBAL
  // ══════════════════════════════════════════
  let mascotas           = [];
  let mascotasFiltradas  = [];
  let razasSeleccionadas = [];
  let estatusSeleccionado = 'todos';

  // ══════════════════════════════════════════
  //  3. CARGA DE DATOS DESDE LA API
  // ══════════════════════════════════════════
  async function cargarReportes() {
    const grid = document.getElementById('pet-grid');

    try {
      const respuesta = await fetch('/api/reportes-alerta', {
        headers: { 'Cache-Control': 'no-store' }
      });

      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      const datos = await respuesta.json();

      // Normalizamos los campos del backend al formato que usa el grid
      mascotas = datos.map(r => ({
        id:         r.id_reporte_alerta,
        nombre:     r.mascota      || 'Sin nombre',
        raza:       r.raza         || 'Sin raza',
        ruac:       r.ruac         || '',
        foto:       r.foto         || null,
        estado:     r.activo === 1 ? 'perdido' : 'encontrado',
        ubicacion:  r.colonia && r.alcaldia ? `${r.colonia}, ${r.alcaldia}` : 'Sin ubicación',
        folio:      `FL-${String(r.id_reporte_alerta).padStart(4, '0')}`,
        recompensa: parseFloat(r.recompensa) || 0,
        comentarios: r.comentarios || '',
        fecha:      r.fecha_expedicion || ''
      }));

      // Actualizar contadores del header
      const total      = mascotas.length;
      const perdidas   = mascotas.filter(m => m.estado === 'perdido').length;
      const encontradas = mascotas.filter(m => m.estado === 'encontrado').length;

      const badges = document.querySelectorAll('.stat-badge');
      if (badges[0]) badges[0].textContent = total;
      if (badges[1]) badges[1].textContent = perdidas;
      if (badges[2]) badges[2].textContent = encontradas;

      // Poblar chips de raza con las razas reales que llegaron
      const razasUnicas = [...new Set(mascotas.map(m => m.raza).filter(Boolean))].sort();
      renderizarChipsRazas('', razasUnicas);

      mascotasFiltradas = [...mascotas];
      renderizarGrid();

    } catch (err) {
      console.error('Error al cargar reportes:', err);
      if (grid) {
        grid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:48px;color:#94a3b8;">
            No se pudieron cargar los reportes. Verifica tu conexión.
          </div>`;
      }
    }
  }

  // ══════════════════════════════════════════
  //  4. RENDER DEL GRID
  // ══════════════════════════════════════════
  function renderizarGrid() {
    const grid    = document.getElementById('pet-grid');
    const conteo  = document.getElementById('resultado-conteo');
    if (!grid) return;

    if (conteo) conteo.textContent = `${mascotasFiltradas.length} resultado${mascotasFiltradas.length !== 1 ? 's' : ''}`;

    grid.innerHTML = '';

    if (mascotasFiltradas.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px;color:#94a3b8;">
          No hay reportes que coincidan con los filtros.
        </div>`;
      return;
    }

    mascotasFiltradas.forEach(m => {
      const card = document.createElement('div');
      card.className = `pet-card ${m.estado}`;
      card.style.cursor = 'pointer';

      const tagClase = m.estado === 'perdido' ? 'perdido' : 'encontrado';
      const fotoHTML = m.foto
        ? `<img src="${m.foto}" alt="${m.nombre}" onerror="this.parentElement.innerHTML='<span style=font-size:48px>🐶</span>'" />`
        : `<span style="font-size:48px;">🐶</span>`;

      card.innerHTML = `
        <div class="pet-card-img">${fotoHTML}</div>
        <div class="pet-card-body">
          <div class="pet-card-header">
            <span class="pet-card-name">${m.nombre}</span>
            <span class="pet-status-badge ${tagClase}">${m.estado.toUpperCase()}</span>
          </div>
          <p class="pet-card-breed">${m.raza}</p>
          <p class="pet-card-location">📍 ${m.ubicacion}</p>
          <p class="pet-card-folio">${m.folio}</p>
          ${m.recompensa > 0 ? `<p class="pet-card-recompensa">💰 $${m.recompensa.toLocaleString('es-MX')} MXN</p>` : ''}
        </div>
      `;

      card.addEventListener('click', () => abrirModal(m));
      grid.appendChild(card);
    });
  }

  // ══════════════════════════════════════════
  //  5. MODAL DE DETALLE
  // ══════════════════════════════════════════
  function abrirModal(m) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    const fotoEl = document.getElementById('modal-foto');
    if (fotoEl) {
      fotoEl.innerHTML = m.foto
        ? `<img src="${m.foto}" alt="${m.nombre}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<span style=font-size:64px>🐶</span>'" />`
        : `<span style="font-size:64px;">🐶</span>`;
    }

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    set('modal-nombre',   m.nombre);
    set('modal-raza',     m.raza);
    set('modal-folio',    m.folio);
    set('modal-ruac',     m.ruac || 'SIN RUAC');
    set('modal-ubicacion', m.ubicacion);
    set('modal-desc',     m.comentarios || 'Sin descripción adicional.');

    const estadoEl = document.getElementById('modal-estado');
    if (estadoEl) {
      const cls = m.estado === 'perdido' ? 'perdido' : 'encontrado';
      estadoEl.innerHTML = `<span class="pet-status-badge ${cls}">${m.estado.toUpperCase()}</span>`;
    }

    overlay.style.display = 'flex';
  }

  window.cerrarModal = function () {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.style.display = 'none';
  };

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cerrarModal();
    });
  }

  // ══════════════════════════════════════════
  //  6. FILTROS
  // ══════════════════════════════════════════
  function ejecutarFiltros() {
    const searchInputEl    = document.getElementById('search-input');
    const filtroRecompensa = document.getElementById('filtro-recompensa');
    const q              = searchInputEl ? searchInputEl.value.toUpperCase().trim() : '';
    const maxRecompensa  = filtroRecompensa ? parseInt(filtroRecompensa.value, 10) : 10000;

    mascotasFiltradas = mascotas.filter(m => {
      const cumpleQuery   = !q || m.ruac.includes(q) || m.folio.toUpperCase().includes(q) || m.nombre.toUpperCase().includes(q);
      const cumpleEstado  = estatusSeleccionado === 'todos' || m.estado === estatusSeleccionado;
      const cumpleRaza    = razasSeleccionadas.length === 0 || razasSeleccionadas.includes(m.raza);
      const cumpleRecompensa = (m.recompensa || 0) <= maxRecompensa;
      return cumpleQuery && cumpleEstado && cumpleRaza && cumpleRecompensa;
    });

    renderizarGrid();
  }

  function renderizarChipsRazas(filtroTexto = '', listaRazas = []) {
    const razaContainer = document.getElementById('raza-tags-container');
    if (!razaContainer) return;
    razaContainer.innerHTML = '';
    const filtradas = listaRazas.filter(r => r.toLowerCase().includes(filtroTexto.toLowerCase()));
    filtradas.forEach(raza => {
      const chip = document.createElement('button');
      chip.className = `chip-raza ${razasSeleccionadas.includes(raza) ? 'active' : ''}`;
      chip.type = 'button';
      chip.textContent = raza;
      chip.addEventListener('click', () => {
        razasSeleccionadas = razasSeleccionadas.includes(raza)
          ? razasSeleccionadas.filter(r => r !== raza)
          : [...razasSeleccionadas, raza];
        chip.classList.toggle('active');
        ejecutarFiltros();
      });
      razaContainer.appendChild(chip);
    });
  }

  // Listeners de filtros
  const buscarRazaInput  = document.getElementById('buscar-raza-input');
  const filtroRecompensa = document.getElementById('filtro-recompensa');
  const recompensaMaxTxt = document.getElementById('recompensa-max');
  const botonesEstatus   = document.querySelectorAll('.btn-status');
  const searchInput      = document.getElementById('search-input');
  const btnClearSearch   = document.getElementById('btn-clear-search');
  const btnReset         = document.getElementById('btn-reset');

  if (buscarRazaInput) {
    buscarRazaInput.addEventListener('input', (e) => {
      const razasUnicas = [...new Set(mascotas.map(m => m.raza).filter(Boolean))].sort();
      renderizarChipsRazas(e.target.value, razasUnicas);
    });
  }

  if (filtroRecompensa) {
    filtroRecompensa.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (recompensaMaxTxt) recompensaMaxTxt.textContent = val === 0 ? 'Sin recompensa' : `$${val.toLocaleString()}`;
      ejecutarFiltros();
    });
  }

  if (botonesEstatus) {
    botonesEstatus.forEach(btn => {
      btn.addEventListener('click', () => {
        botonesEstatus.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        estatusSeleccionado = btn.dataset.value || btn.dataset.status || 'todos';
        ejecutarFiltros();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      searchInput.value = val;
      if (btnClearSearch) btnClearSearch.style.display = val ? 'block' : 'none';
      ejecutarFiltros();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      btnClearSearch.style.display = 'none';
      ejecutarFiltros();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      razasSeleccionadas  = [];
      estatusSeleccionado = 'todos';
      if (searchInput)      searchInput.value = '';
      if (filtroRecompensa) filtroRecompensa.value = 10000;
      if (recompensaMaxTxt) recompensaMaxTxt.textContent = '$10,000';
      if (btnClearSearch)   btnClearSearch.style.display = 'none';
      botonesEstatus.forEach((b, i) => b.classList.toggle('active', i === 0));
      const razasUnicas = [...new Set(mascotas.map(m => m.raza).filter(Boolean))].sort();
      renderizarChipsRazas('', razasUnicas);
      ejecutarFiltros();
    });
  }

  // ══════════════════════════════════════════
  //  7. SIDEBAR NAV (abrir/cerrar)
  // ══════════════════════════════════════════
  let navAbierto = true;
  const navSidebar   = document.getElementById('nav-sidebar');
  const avatarFloat  = document.getElementById('avatar-float');
  const avatarBtn    = document.getElementById('avatar-btn');
  const avatarBtnFloat = document.getElementById('avatar-btn-float');

  function cerrarNav() {
    navAbierto = false;
    if (navSidebar)  navSidebar.style.display  = 'none';
    if (avatarFloat) avatarFloat.style.display = 'flex';
  }
  function abrirNav() {
    navAbierto = true;
    if (navSidebar)  navSidebar.style.display  = '';
    if (avatarFloat) avatarFloat.style.display = 'none';
  }

  if (avatarBtn)      avatarBtn.addEventListener('click', cerrarNav);
  if (avatarBtnFloat) avatarBtnFloat.addEventListener('click', abrirNav);

  // Notificaciones
  const bellBtn      = document.getElementById('bell-btn');
  const notifPopover = document.getElementById('notif-popover');
  if (bellBtn && notifPopover) {
    bellBtn.addEventListener('click', () => {
      notifPopover.style.display = notifPopover.style.display === 'none' ? 'block' : 'none';
    });
  }
  window.cerrarNotif = function () {
    if (notifPopover) notifPopover.style.display = 'none';
  };

  // ══════════════════════════════════════════
  //  8. ARRANQUE
  // ══════════════════════════════════════════
  await cargarReportes();
});