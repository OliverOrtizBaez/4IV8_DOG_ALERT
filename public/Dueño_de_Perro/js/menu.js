const mascotas = [
  // Tus objetos de mascotas van aquí...
];

let mascotasFiltradas = [...mascotas];
let navAbierto = true;

// --- NUEVAS VARIABLES PARA LOS FILTROS AVANZADOS DEL NUEVO DISEÑO ---
let razasSeleccionadas = []; // Almacena los chips de razas activos
let estatusSeleccionado = 'todos'; // Almacena el estatus activo ('todos', 'perdido', 'encontrado')

// Lista fija de razas para renderizar en el contenedor con scroll dinámico
const listaRazas = [
  "Affenpinscher", "Akita", "Alaskan Malamute", "American Bully",
  "American Staffordshire Terrier", "Basset Hound", "Beagle",
  "Bichón Frisé", "Border Collie", "Boxer", "Bull Terrier",
  "Bulldog Francés", "Chihuahua", "Golden Retriever",
  "Husky Siberiano", "Labrador Retriever", "Pug", "Rottweiler"
].sort();

// --- ELEMENTOS DEL DOM CAPTURADOS ---
const razaContainer = document.getElementById('raza-tags-container');
const buscarRazaInput = document.getElementById('buscar-raza-input');
const filtroRecompensa = document.getElementById('filtro-recompensa');
const recompensaMaxTxt = document.getElementById('recompensa-max');
const botonesEstatus = document.querySelectorAll('.btn-status');

// --- FUNCIONES DE RENDERIZADO DINÁMICO ---

// Dibuja los chips de razas en el contenedor '#raza-tags-container'
function renderizarChipsRazas(filtroTexto = "") {
  if (!razaContainer) return;
  razaContainer.innerHTML = "";

  // Filtramos la lista fija según lo que se escriba en el buscador de razas
  const razasFiltradas = listaRazas.filter(raza => 
    raza.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  razasFiltradas.forEach(raza => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('chip-raza');
    button.textContent = raza;

    if (razasSeleccionadas.includes(raza)) {
      button.classList.add('active');
    }

    // Manejo de la selección múltiple de razas
    button.addEventListener('click', () => {
      if (razasSeleccionadas.includes(raza)) {
        razasSeleccionadas = razasSeleccionadas.filter(r => r !== raza);
        button.classList.remove('active');
      } else {
        razasSeleccionadas.push(raza);
        button.classList.add('active');
      }
      filtrar(); // Dispara el filtrado global
    });

    razaContainer.appendChild(button);
  });
}

function etiquetaEstado(estado) {
  const map = { 
    'perdido': { texto: 'Perdido', clase: 'perdido' }, 
    'encontrado': { texto: 'Encontrado', clase: 'encontrado' }, 
    'en-adopcion': { texto: 'En Adopción', clase: 'en-adopcion' } 
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

// --- CONFIGURACIÓN DE ESCUCHADORES DE EVENTOS ACTUALIZADOS ---

document.getElementById('modal-overlay').addEventListener('click', function(e) { 
  if (e.target === this) cerrarModal(); 
});

document.getElementById('search-input').addEventListener('input', function() {
  this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  filtrar();
});

document.getElementById('btn-clear-search').addEventListener('click', function() {
  document.getElementById('search-input').value = '';
  filtrar();
});

// Escuchar cambios en el input del buscador de razas interno
if (buscarRazaInput) {
  buscarRazaInput.addEventListener('input', (e) => {
    renderizarChipsRazas(e.target.value);
  });
}

// Asignar el cambio de estado a los nuevos botones planos (.btn-status)
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

// Asignar el evento en tiempo real al slider de recompensa
if (filtroRecompensa) {
  filtroRecompensa.addEventListener('input', (e) => {
    const valor = parseInt(e.target.value, 10);
    if (recompensaMaxTxt) recompensaMaxTxt.textContent = `$${valor.toLocaleString()}`;
    filtrar();
  });
}

// Reemplazo del comportamiento del botón "Limpiar" para acomodar los nuevos elementos
document.getElementById('btn-reset').addEventListener('click', function() {
  document.getElementById('search-input').value = '';
  
  // Resetear botones de estatus a "Todos"
  estatusSeleccionado = 'todos';
  if (botonesEstatus) {
    botonesEstatus.forEach(b => b.classList.remove('active'));
    const btnTodos = Array.from(botonesEstatus).find(b => b.getAttribute('data-value') === 'todos');
    if (btnTodos) btnTodos.classList.add('active');
  }

  // Desmarcar chips de razas y limpiar su buscador
  razasSeleccionadas = [];
  if (buscarRazaInput) buscarRazaInput.value = '';
  renderizarChipsRazas();

  // Devolver el slider de recompensa a su valor máximo original
  if (filtroRecompensa) {
    filtroRecompensa.value = 10000;
    if (recompensaMaxTxt) recompensaMaxTxt.textContent = '$10,000';
  }

  filtrar();
});

// --- FUNCIÓN FILTRAR ADAPTADA A LA NUEVA INTERFAZ ---
function filtrar() {
  const q = document.getElementById('search-input').value.trim();
  const maxRecompensa = filtroRecompensa ? parseInt(filtroRecompensa.value, 10) : 10000;

  mascotasFiltradas = mascotas.filter(m => {
    // 1. Buscador global (Por texto en RUAC, Folio o Nombre)
    const cumpleQuery = !q || m.ruac.includes(q) || m.folio.toUpperCase().includes(q) || m.nombre.toUpperCase().includes(q);
    
    // 2. Filtro por botones planos de Estatus
    const cumpleEstado = estatusSeleccionado === 'todos' || m.estado === estatusSeleccionado;
    
    // 3. Filtro por colección de Chips de Raza
    const cumpleRaza = razasSeleccionadas.length === 0 || razasSeleccionadas.includes(m.raza);
    
    // 4. Filtro por rango de Recompensa máxima del slider
    const recompensaMascota = m.recompensa || 0;
    const cumpleRecompensa = recompensaMascota <= maxRecompensa;

    return cumpleQuery && cumpleEstado && cumpleRaza && cumpleRecompensa;
  });

  renderizarGrid();
  document.getElementById('btn-clear-search').style.display = document.getElementById('search-input').value ? 'block' : 'none';
}

// Animación de colapsado del menú lateral
function toggleNav() {
  navAbierto = !navAbierto;
  document.getElementById('nav-sidebar').classList.toggle('collapsed', !navAbierto);
  document.getElementById('avatar-float').style.display = navAbierto ? 'none' : 'block';
}

document.getElementById('avatar-btn').addEventListener('click', toggleNav);
document.getElementById('avatar-btn-float').addEventListener('click', toggleNav);

// --- EJECUCIÓN INICIAL AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
  renderizarChipsRazas();
  renderizarGrid();
  document.getElementById('btn-clear-search').style.display = 'none';
});