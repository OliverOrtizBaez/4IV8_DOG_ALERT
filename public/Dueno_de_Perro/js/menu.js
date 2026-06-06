document.addEventListener('DOMContentLoaded', () => {
  // Intentamos leer de localStorage o sessionStorage (el que tenga los datos)
  const idUsuario     = localStorage.getItem('id_usuario') || sessionStorage.getItem('id_usuario');
  const nombreUsuario = localStorage.getItem('nombre_usuario') || sessionStorage.getItem('nombre_usuario');
  const tipoUsuario   = localStorage.getItem('tipo_usuario') || sessionStorage.getItem('tipo_usuario');

  const navUserName = document.querySelector('.nav-user-name'); 

  if (idUsuario && nombreUsuario) {
    console.log(`Sesión validada correctamente: ${nombreUsuario}`);
    if (navUserName) {
      navUserName.textContent = nombreUsuario;
    }
  } else {
    // Si llegamos aquí vacíos, nos saca. Con el doble guardado esto ya no pasará.
    console.warn("Sin credenciales en memoria. Redirigiendo a anónimo...");
    window.location.href = '/Sin_Usuario/menu_sinusuario.html';
  }

  const btnLogout = document.querySelector('.nav-item.cerrar');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      alert('Sesión finalizada.');
      window.location.href = '/Sin_Usuario/menu_sinusuario.html';
    });
  }
});

// LÓGICA DE FILTROS ORIGINAL
const mascotas = [];
let mascotasFiltradas = [...mascotas];
let navAbierto = true;
let razasSeleccionadas = []; 
let estatusSeleccionado = 'todos'; 

const listaRazas = [
  "Mestizo / Criollo", "Husky Siberiano", "Pug", "Chihuahua", "Pitbull",
  "Golden Retriever", "Pastor Alemán", "Labrador Retriever", "Bulldog Francés",
  "Poodle (Caniche)", "Schnauzer", "Dóberman"
].sort();

const razaContainer = document.getElementById('raza-tags-container');
const buscarRazaInput = document.getElementById('buscar-raza-input');
const filtroRecompensa = document.getElementById('filtro-recompensa');
const recompensaMaxTxt = document.getElementById('recompensa-max');
const botonesEstatus = document.querySelectorAll('.btn-status');

function renderizarChipsRazas(filtroTexto = '') {
  if (!razaContainer) return;
  razaContainer.innerHTML = '';
  const filtradas = listaRazas.filter(r => r.toLowerCase().includes(filtroTexto.toLowerCase()));
  filtradas.forEach(raza => {
    const chip = document.createElement('button');
    chip.className = `chip-raza ${razasSeleccionadas.includes(raza) ? 'active' : ''}`;
    chip.type = 'button';
    chip.textContent = raza;
    chip.addEventListener('click', () => {
      if (razasSeleccionadas.includes(raza)) {
        razasSeleccionadas = razasSeleccionadas.filter(item => item !== raza);
      } else {
        razasSeleccionadas.push(raza);
      }
      chip.classList.toggle('active');
      ejecutarFiltros();
    });
    razaContainer.appendChild(chip);
  });
}

if (buscarRazaInput) buscarRazaInput.addEventListener('input', (e) => renderizarChipsRazas(e.target.value));
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
      estatusSeleccionado = btn.getAttribute('data-value') || btn.dataset.status;
      ejecutarFiltros();
    });
  });
}

function renderizarGrid() {
  const grid = document.getElementById('pet-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (mascotasFiltradas.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:#94a3b8;">No hay reportes.</div>';
    return;
  }
  mascotasFiltradas.forEach(m => {
    const card = document.createElement('div');
    card.className = `pet-card ${m.estado}`;
    const tagClase = m.estado === 'perdido' ? 'perdido' : 'encontrado';
    card.innerHTML = `
      <div class="pet-card-img"><img src="${m.foto}" onerror="this.parentElement.innerHTML='🐶'" /></div>
      <div class="pet-card-body">
        <div class="pet-card-header"><span class="pet-card-name">${m.nombre}</span><span class="pet-status-badge ${tagClase}">${m.estado.toUpperCase()}</span></div>
        <p class="pet-card-breed">${m.raza}</p>
        <p class="pet-card-location">📍 ${m.ubicacion}</p>
        <p class="pet-card-folio">${m.folio}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function ejecutarFiltros() {
  const searchInputEl = document.getElementById('search-input');
  const q = searchInputEl ? searchInputEl.value.toUpperCase().trim() : '';
  const maxRecompensa = filtroRecompensa ? parseInt(filtroRecompensa.value, 10) : 10000;
  mascotasFiltradas = mascotas.filter(m => {
    const cumpleQuery = !q || (m.ruac && m.ruac.includes(q)) || (m.folio && m.folio.toUpperCase().includes(q)) || (m.nombre && m.nombre.toUpperCase().includes(q));
    const cumpleEstado = estatusSeleccionado === 'todos' || m.estado === estatusSeleccionado;
    const cumpleRaza = razasSeleccionadas.length === 0 || razasSeleccionadas.includes(m.raza);
    return cumpleQuery && cumpleEstado && cumpleRaza && (m.recompensa || 0) <= maxRecompensa;
  });
  renderizarGrid();
}

renderizarChipsRazas();
renderizarGrid();