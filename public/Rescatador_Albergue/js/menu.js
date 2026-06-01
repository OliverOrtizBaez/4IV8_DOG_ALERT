// ==========================================================================
// 1. BASE DE DATOS Y VARIABLES GLOBALES
// ==========================================================================
const mascotas = [
  // Tus objetos de mascotas van aquí...
];

let mascotasFiltradas = [...mascotas];
let navAbierto = true;

// Variables de estado para los Filtros del Sidebar
let razasSeleccionadas = []; 
let estatusSeleccionado = 'todos'; 

// Lista fija de razas para renderizar en el contenedor de scroll (como en imagen_2026-05-31_220532621.png)
const listaRazas = [
  "Affenpinscher", "Akita", "Alaskan Malamute", "American Bully",
  "American Staffordshire Terrier", "Basset Hound", "Beagle",
  "Bichón Frisé", "Border Collie", "Boxer", "Bull Terrier",
  "Bulldog Francés", "Chihuahua", "Golden Retriever",
  "Husky Siberiano", "Labrador Retriever", "Pug", "Rottweiler"
].sort();

// ==========================================================================
// 2. ELEMENTOS DEL DOM (Aseguramos su existencia antes de usarlos)
// ==========================================================================
let razaContainer, buscarRazaInput, filtroRecompensa, recompensaMaxTxt, botonesEstatus;

function inicializarElementosDOM() {
  razaContainer = document.getElementById('raza-tags-container');
  buscarRazaInput = document.getElementById('buscar-raza-input');
  filtroRecompensa = document.getElementById('filtro-recompensa');
  recompensaMaxTxt = document.getElementById('recompensa-max');
  botonesEstatus = document.querySelectorAll('.btn-status');
}

// ==========================================================================
// 3. FUNCIONES DE RENDERIZADO DINÁMICO
// ==========================================================================

// Inyecta los botones redondeados de las razas dentro del HTML
function renderizarChipsRazas(filtroTexto = "") {
  if (!razaContainer) return;
  
  razaContainer.innerHTML = ""; // Limpiamos el contenedor

  // Filtramos la lista fija según el buscador de razas
  const razasFiltradas = listaRazas.filter(raza => 
    raza.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  // Creamos y metemos cada chip al HTML
  razasFiltradas.forEach(raza => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('chip-raza');
    button.textContent = raza;

    if (razasSeleccionadas.includes(raza)) {
      button.classList.add('active');
    }

    // Evento al hacer click en una raza
    button.addEventListener('click', () => {
      if (razasSeleccionadas.includes(raza)) {
        razasSeleccionadas = razasSeleccionadas.filter(r => r !== raza);
        button.classList.remove('active');
      } else {
        razasSeleccionadas.push(raza);
        button.classList.add('active');
      }
      filtrar(); 
    });

    razaContainer.appendChild(button);
  });
}

function etiquetaEstado(estado) {
  const map = { 
    'perdido': { texto: 'Perdido', clase: 'perdido' }, 
    'encontrado': { texto: 'Encontrado', clase: 'encontrado' }, 
  };
  return map[estado] || { texto: estado, clase: '' };
}

function renderizarGrid() {
  const grid = document.getElementById('pet-grid');
  if (!grid) return;

  const conteoEl = document.getElementById('resultado-conteo');
  if (conteoEl) {
    conteoEl.textContent = mascotasFiltradas.length + ' resultado' + (mascotasFiltradas.length !== 1 ? 's' : '');
  }
  
  if (!mascotasFiltradas.length) { 
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:#94a3b8;">No se encontraron mascotas.</div>'; 
    return; 
  }
  
  grid.innerHTML = mascotasFiltradas.map(m => {
    const { texto, clase } = etiquetaEstado(m.estado);
    return `<div class="pet-card" onclick="abrirModal('${m.id}')">
      <div class="pet-card-img"><img src="${m.foto}" alt="${m.nombre}" onerror="this.parentElement.innerHTML='🐶'" /></div>
      <div class="pet-card-body">
        <div class="pet-card-header"><span class="pet-card-name">${m.nombre}</span><span class="pet-status-badge ${clase}">${texto}</span></div>
        <p class="pet-card-breed">${m.raza}</p>
        <p class="pet-card-location">📍 ${m.ubicacion}</p>
        <p class="pet-card-folio">${m.folio}</p>
      </div>
    </div>`;
  }).join('');
}

// ==========================================================================
// 4. MODALES
// ==========================================================================
function abrirModal(id) {
  const m = mascotas.find(x => x.id === id);
  if (!m) return;
  const { texto, clase } = etiquetaEstado(m.estado);
  document.getElementById('modal-foto').innerHTML = `<img src="${m.foto}" alt="${m.nombre}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=''">`;
  document.getElementById('modal-nombre').textContent = m.nombre;
  document.getElementById('modal-estado').innerHTML = `<span class="pet-status-badge ${clase}">${texto}</span>`;
  document.getElementById('modal-raza').textContent = m.raza;
  document.getElementById('modal-folio').textContent = m.folio;
  document.getElementById('modal-ruac').textContent = m.ruac;
  document.getElementById('modal-ubicacion').textContent = m.ubicacion;
  document.getElementById('modal-desc').textContent = m.descripcion;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ==========================================================================
// 5. SISTEMA CORE DE FILTRADO COMBINADO
// ==========================================================================
function filtrar() {
  const searchInput = document.getElementById('search-input');
  const q = searchInput ? searchInput.value.trim() : '';
  const maxRecompensa = filtroRecompensa ? parseInt(filtroRecompensa.value, 10) : 10000;

  mascotasFiltradas = mascotas.filter(m => {
    const cumpleQuery = !q || m.ruac.includes(q) || m.folio.toUpperCase().includes(q) || m.nombre.toUpperCase().includes(q);
    const cumpleEstado = estatusSeleccionado === 'todos' || m.estado === estatusSeleccionado;
    const cumpleRaza = razasSeleccionadas.length === 0 || razasSeleccionadas.includes(m.raza);
    const recompensaMascota = m.recompensa || 0;
    const cumpleRecompensa = recompensaMascota <= maxRecompensa;

    return cumpleQuery && cumpleEstado && cumpleRaza && cumpleRecompensa;
  });

  renderizarGrid();
  
  const btnClearSearch = document.getElementById('btn-clear-search');
  if (btnClearSearch && searchInput) {
    btnClearSearch.style.display = searchInput.value ? 'block' : 'none';
  }
}

function toggleNav() {
  navAbierto = !navAbierto;
  document.getElementById('nav-sidebar').classList.toggle('collapsed', !navAbierto);
  document.getElementById('avatar-float').style.display = navAbierto ? 'none' : 'block';
}

// ==========================================================================
// 6. ENLACE DE EVENTOS Y ASIGNACIÓN (Se ejecuta cuando el HTML está listo)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado. Inicializando filtros...");
  
  // Capturamos los elementos del DOM
  inicializarElementosDOM();

  // 1. Renderizar los chips de las razas fijas en el HTML
  renderizarChipsRazas();

  // 2. Escuchar el buscador interno de razas
  if (buscarRazaInput) {
    buscarRazaInput.addEventListener('input', (e) => {
      renderizarChipsRazas(e.target.value);
    });
  }

  // 3. Escuchar los botones de estatus
  if (botonesEstatus) {
    botonesEstatus.forEach(btn => {
      btn.addEventListener('click', () => {
        botonesEstatus.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        estatusSeleccionado = btn.getAttribute('data-value');
        filtrar();
      });
    });
  }

  // 4. Escuchar el rango del slider de recompensa
  if (filtroRecompensa) {
    filtroRecompensa.addEventListener('input', (e) => {
      const valor = parseInt(e.target.value, 10);
      if (recompensaMaxTxt) recompensaMaxTxt.textContent = `$${valor.toLocaleString()}`;
      filtrar();
    });
  }

  // 5. Escuchar eventos de modales y busquedas generales existentes
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) { if (e.target === this) cerrarModal(); });
  }

  const mainSearchInput = document.getElementById('search-input');
  if (mainSearchInput) {
    mainSearchInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      filtrar();
    });
  }

  const btnClearSearch = document.getElementById('btn-clear-search');
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', function() {
      if (mainSearchInput) mainSearchInput.value = '';
      filtrar();
    });
    btnClearSearch.style.display = 'none';
  }

  // 6. Configurar botón de limpiar filtros (Reset)
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      if (mainSearchInput) mainSearchInput.value = '';
      
      estatusSeleccionado = 'todos';
      if (botonesEstatus) {
        botonesEstatus.forEach(b => b.classList.remove('active'));
        const btnTodos = Array.from(botonesEstatus).find(b => b.getAttribute('data-value') === 'todos');
        if (btnTodos) btnTodos.classList.add('active');
      }

      razasSeleccionadas = [];
      if (buscarRazaInput) buscarRazaInput.value = '';
      renderizarChipsRazas();

      if (filtroRecompensa) {
        filtroRecompensa.value = 10000;
        if (recompensaMaxTxt) recompensaMaxTxt.textContent = '$10,000';
      }

      filtrar();
    });
  }

  // 7. Eventos de navegación lateral
  const avatarBtn = document.getElementById('avatar-btn');
  if (avatarBtn) avatarBtn.addEventListener('click', toggleNav);

  const avatarBtnFloat = document.getElementById('avatar-btn-float');
  if (avatarBtnFloat) avatarBtnFloat.addEventListener('click', toggleNav);

  // Render inicial de tarjetas
  renderizarGrid();
  console.log("Inicialización completada con éxito.");
});