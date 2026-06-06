// ─── COMPROBACIÓN DE SESIÓN ACTIVA (REDIRECCIÓN INVERSA) ───
document.addEventListener('DOMContentLoaded', () => {
  const idUsuario     = localStorage.getItem('id_usuario');
  const tipoUsuario   = localStorage.getItem('tipo_usuario');

  // Si un usuario ya logueado entra aquí por error, lo mandamos a su zona privada automáticamente
  if (idUsuario && tipoUsuario) {
    if (tipoUsuario === 'Dueño de mascota') {
      window.location.href = '/Dueno_de_Perro/menu_duenodeperro.html';
    } else if (tipoUsuario === 'Rescatista o Albergue') {
      window.location.href = '/Rescatador_Albergue/menu_rescaoalber.html';
    }
  }
});

// ─── LÓGICA DEL MENÚ PÚBLICO (INVITADOS) ───

const mascotas = [
  // Aquí van tus objetos de mascotas públicos...
];

let mascotasFiltradas = [...mascotas];
let navAbierto = true;

// --- VARIABLES PARA FILTROS AVANZADOS ---
let razasSeleccionadas = []; 
let estatusSeleccionado = 'todos'; 

// 🚨 ALINEADO CON TU BASE DE DATOS: Lista de razas oficial de catalogo_raza
const listaRazas = [
  "Mestizo / Criollo",
  "Husky Siberiano",
  "Pug",
  "Chihuahua",
  "Pitbull",
  "Golden Retriever",
  "Pastor Alemán",
  "Labrador Retriever",
  "Bulldog Francés",
  "Poodle (Caniche)",
  "Schnauzer",
  "Dóberman"
].sort(); // Se mantiene ordenado alfabéticamente en la interfaz lateral[cite: 12]

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

  // Filtramos la lista fija según el buscador interno de razas
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

    // Evento de selección múltiple de los chips de raza
    button.addEventListener('click', () => {
      if (razasSeleccionadas.includes(raza)) {
        razasSeleccionadas = razasSeleccionadas.filter(r => r !== raza);
        button.classList.remove('active');
      } else {
        razasSeleccionadas.push(raza);
        button.classList.add('active');
      }
      filtrar(); // Ejecuta el filtro combinado
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

// --- ESCUCHADORES DE EVENTOS ADAPTADOS ---

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

// Escuchar cambios en el input buscador de razas
if (buscarRazaInput) {
  buscarRazaInput.addEventListener('input', (e) => {
    renderizarChipsRazas(e.target.value);
  });
}

// Escuchar clicks en los botones de estatus (.btn-status)
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

// Escuchar cambios en el slider de recompensa máxima
if (filtroRecompensa) {
  filtroRecompensa.addEventListener('input', (e) => {
    const valor = parseInt(e.target.value, 10);
    if (recompensaMaxTxt) recompensaMaxTxt.textContent = `$${valor.toLocaleString()}`;
    filtrar();
  });
}

// Comportamiento actualizado del botón "Limpiar" (Reset)
document.getElementById('btn-reset').addEventListener('click', function() {
  document.getElementById('search-input').value = '';
  
  // Regresar estatus al botón "Todos"
  estatusSeleccionado = 'todos';
  if (botonesEstatus) {
    botonesEstatus.forEach(b => b.classList.remove('active'));
    const btnTodos = Array.from(botonesEstatus).find(b => b.getAttribute('data-value') === 'todos');
    if (btnTodos) btnTodos.classList.add('active');
  }

  // Limpiar selección de los chips de razas y su buscador interno
  razasSeleccionadas = [];
  if (buscarRazaInput) buscarRazaInput.value = '';
  renderizarChipsRazas();

  // Resetear el slider de recompensa al tope máximo
  if (filtroRecompensa) {
    filtroRecompensa.value = 10000;
    if (recompensaMaxTxt) recompensaMaxTxt.textContent = '$10,000';
  }

  filtrar();
});

// --- FUNCIÓN FILTRAR ---
function filtrar() {
  const q = document.getElementById('search-input').value.trim();
  const maxRecompensa = filtroRecompensa ? parseInt(filtroRecompensa.value, 10) : 10000;

  mascotasFiltradas = mascotas.filter(m => {
    // 1. Filtro del buscador global por texto (RUAC, Folio o Nombre)
    const cumpleQuery = !q || m.ruac.includes(q) || m.folio.toUpperCase().includes(q) || m.nombre.toUpperCase().includes(q);
    
    // 2. Filtro por estatus seleccionado
    const cumpleEstado = estatusSeleccionado === 'todos' || m.estado === estatusSeleccionado;
    
    // 3. Filtro por colección de chips de raza
    const cumpleRaza = razasSeleccionadas.length === 0 || razasSeleccionadas.includes(m.raza);
    
    // 4. Filtro por el rango de recompensa del slider
    const recompensaMascota = m.recompensa || 0;
    const cumpleRecompensa = recompensaMascota <= maxRecompensa;

    return cumpleQuery && cumpleEstado && cumpleRaza && cumpleRecompensa;
  });

  renderizarGrid();
  document.getElementById('btn-clear-search').style.display = document.getElementById('search-input').value ? 'block' : 'none';
}

// Control colapsable del menú lateral público
function toggleNav() {
  navAbierto = !navAbierto;
  const sidebar = document.getElementById('nav-sidebar');
  const avatarFl = document.getElementById('avatar-float');
  if (sidebar) sidebar.classList.toggle('collapsed', !navAbierto);
  if (avatarFl) avatarFl.style.display = navAbierto ? 'none' : 'block';
}

const avatarBtn = document.getElementById('avatar-btn');
if (avatarBtn) avatarBtn.addEventListener('click', toggleNav);

const avatarBtnFloat = document.getElementById('avatar-btn-float');
if (avatarBtnFloat) avatarBtnFloat.addEventListener('click', toggleNav);

// --- EJECUCIÓN INICIAL ---
renderizarChipsRazas();
renderizarGrid();