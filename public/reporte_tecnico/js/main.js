const TIPOS = [
  {
    id: 'app',
    titulo: 'Error en la aplicación',
    descripcion: 'La app se cierra, se congela o no responde',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M8 6s-4 2-4 6 4 6 4 6"/><path d="M16 6s4 2 4 6-4 6-4 6"/>
      <line x1="12" y1="12" x2="12" y2="12"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
      <path d="M9 12h.01M15 12h.01"/>
    </svg>`,
    svgAlt: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>`,
  },
  {
    id: 'imagenes',
    titulo: 'Problema con imágenes',
    descripcion: 'Las fotos no cargan o no se pueden subir',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/><line x1="2" y1="2" x2="22" y2="22"/>
    </svg>`,
  },
  {
    id: 'busqueda',
    titulo: 'Error al buscar por RUAC',
    descripcion: 'El buscador no encuentra resultados o falla',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>`,
  },
  {
    id: 'sesion',
    titulo: 'Problema de inicio de sesión',
    descripcion: 'No puedo entrar a mi cuenta o me cierra la sesión',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
    </svg>`,
  },
  {
    id: 'reportes',
    titulo: 'Error en mis reportes',
    descripcion: 'No puedo crear, ver o editar mis reportes',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="15" x2="15" y2="9"/><line x1="9" y1="9" x2="9.01" y2="9"/>
    </svg>`,
  },
  {
    id: 'conexion',
    titulo: 'Problema de conexión',
    descripcion: 'La app no carga o pierde datos al navegar',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>`,
  },
  {
    id: 'otro',
    titulo: 'Otro error',
    descripcion: 'El problema no está en ninguna de las categorías anteriores',
    svg: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
  },
];

let paso = 'elegir';
let tipoId = null;

/* ------- render tipo list ------- */
function renderLista() {
  const list = document.getElementById('tipo-list');
  list.innerHTML = TIPOS.map(t => `
    <button class="tipo-btn" data-id="${t.id}">
      <div class="tipo-icon">${t.svg}</div>
      <div class="tipo-text">
        <div class="title">${t.titulo}</div>
        <div class="desc">${t.descripcion}</div>
      </div>
      <svg class="chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  `).join('');
  list.querySelectorAll('.tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => seleccionar(btn.dataset.id));
  });
}

/* ------- pasos ------- */
function setPaso(p) {
  paso = p;
  document.getElementById('paso-elegir').classList.toggle('hidden', p !== 'elegir');
  document.getElementById('paso-detalle').classList.toggle('hidden', p !== 'detalle');
  document.getElementById('paso-enviado').classList.toggle('hidden', p !== 'enviado');
  document.getElementById('step-dots').classList.toggle('hidden', p === 'enviado');

  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const sub = document.getElementById('header-sub');

  if(p === 'elegir') {
    dot1.className = 'dot active';
    dot2.className = 'dot inactive';
    sub.classList.add('hidden');
    sub.textContent = '';
  } else if(p === 'detalle') {
    dot1.className = 'dot done';
    dot2.className = 'dot active';
    const tipo = TIPOS.find(t => t.id === tipoId);
    sub.textContent = tipo?.titulo || '';
    sub.classList.remove('hidden');
  }
}

function seleccionar(id) {
  tipoId = id;
  const tipo = TIPOS.find(t => t.id === id);
  if(!tipo) return;

  document.getElementById('selected-icon').innerHTML = tipo.svg;
  document.getElementById('selected-title').textContent = tipo.titulo;
  document.getElementById('selected-desc').textContent = tipo.descripcion;
  document.getElementById('textarea-detalle').value = '';
  setPaso('detalle');
}

document.getElementById('btn-enviar').addEventListener('click', () => {
  const tipo = TIPOS.find(t => t.id === tipoId);
  document.getElementById('success-tipo').textContent = `"${tipo?.titulo}"`;
  setPaso('enviado');
});

document.getElementById('btn-cambiar').addEventListener('click', () => setPaso('elegir'));

document.getElementById('btn-back').addEventListener('click', () => {
  if(paso === 'elegir') history.back();
  else setPaso('elegir');
});

renderLista();
setPaso('elegir');