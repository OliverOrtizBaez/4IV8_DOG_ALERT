const MAX = 6;
const KEY = 'dog_alert_mascotas';

// Función auxiliar para leer del LocalStorage en caso de respaldo
function getMascotasLocales() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

async function render() {
  const idUsuario = localStorage.getItem('id_usuario') || sessionStorage.getItem('id_usuario');
  const grid     = document.getElementById('grid');
  const empty    = document.getElementById('empty');
  const conteo   = document.getElementById('conteo');
  const btnNueva = document.getElementById('btn-nueva');

  if (!grid) return;
  grid.innerHTML = '';

  let mascotas = [];

  try {
    // Intentamos traer las mascotas reales de este usuario desde MySQL
    const respuesta = await fetch(`/api/mascotas/usuario/${idUsuario}`);
    if (respuesta.ok) {
      mascotas = await respuesta.json();
    } else {
      mascotas = getMascotasLocales();
    }
  } catch (error) {
    console.warn("Cargando desde el almacenamiento local del navegador.");
    mascotas = getMascotasLocales();
  }

  // Actualizamos el contador de capacidad (0 / 6)
  if (conteo) {
    conteo.textContent = `${mascotas.length} / ${MAX} registradas`;
  }

  const lleno = mascotas.length >= MAX;
  if (btnNueva) {
    if (lleno) {
      btnNueva.style.pointerEvents = 'none';
      btnNueva.style.opacity = '0.5';
    } else {
      btnNueva.style.pointerEvents = 'auto';
      btnNueva.style.opacity = '1';
    }
  }

  // Si no hay perritos, mostramos el estado vacío integrado de tu HTML
  if (mascotas.length === 0) {
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  const sexoBadge = { Macho: 'badge-macho', Hembra: 'badge-hembra' };
  const tamanoBadge = { Chico: 'badge-chico', Mediano: 'badge-mediano', Grande: 'badge-grande' };

  // Mapeo e inyección dinámica idéntica a tus estilos CSS
  grid.innerHTML = mascotas.map(m => `
    <div class="pet-card">
      <div class="pet-card-img">
        <img src="${m.foto || '../img/dog-placeholder.png'}" alt="${m.nombre}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><text y=%2250%%22 x=%2250%%22 dy=%22.3em%22 text-anchor=%22middle%22 font-size=%2250%22>🐶</text></svg>'" />
      </div>
      <div class="pet-card-body">
        <div class="pet-card-header">
          <p class="pet-name">${m.nombre}</p>
          <div class="badges">
            <span class="badge ${sexoBadge[m.sexo] || 'badge-macho'}">${m.sexo || 'Macho'}</span>
            <span class="badge ${tamanoBadge[m.tamano || m.tamaño] || 'badge-mediano'}">${m.tamano || m.tamaño || 'Mediano'}</span>
          </div>
        </div>
        <p class="pet-raza">${m.raza}</p>
        <p class="pet-meta">${m.edad} ${m.edad === 1 ? 'año' : 'años'} · ${m.peso} kg</p>
        <div class="pet-footer">
          <span class="pet-ruac">${m.ruac || 'SIN RUAC'}</span>
          <span class="pet-fecha">${m.fechaRegistro || 'Reciente'}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Si aún queda cupo, agregamos la tarjeta con el signo de más (+) para invitar a registrar
  if (!lleno) {
    const cell = document.createElement('a');
    cell.href = './nueva_mascota.html'; // Ruta corregida con guión bajo
    cell.className = 'add-cell';
    cell.innerHTML = `
      <svg width=\"32\" height=\"32\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\">
        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 4v16m8-8H4\"/>
      </svg>
      <p>Registrar otra mascota</p>
    `;
    grid.appendChild(cell);
  }
}

// Inicialización automática cuando carga el documento
document.addEventListener('DOMContentLoaded', render);