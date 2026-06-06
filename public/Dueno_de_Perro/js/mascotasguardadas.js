const KEY = 'dog_alert_guardadas';

function getGuardadas() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
function saveGuardadas(lista) {
  localStorage.setItem(KEY, JSON.stringify(lista));
}
function eliminar(id) {
  saveGuardadas(getGuardadas().filter(p => p.id !== id));
}
function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
}

let confirmingId = null;
let modalPetId = null;

/* -------- capacidad bar -------- */
function updateCap(n) {
  document.getElementById('cap-text').textContent = `${n} de 10 guardadas`;
  document.getElementById('cap-label').textContent = `${n}/10`;
  const fill = document.getElementById('bar-fill');
  fill.style.width = `${(n/10)*100}%`;
  fill.style.background = n>=10 ? '#ef4444' : n>=7 ? '#f59e0b' : '#34d399';
}

/* -------- render -------- */
function render() {
  const pets = getGuardadas();
  updateCap(pets.length);
  const container = document.getElementById('grid-container');

  if(pets.length===0){
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">
          <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p class="title">Sin mascotas guardadas</p>
        <p class="sub">Toca el botón <span class="kw">Guardar</span> en cualquier tarjeta del inicio para agregarla aquí.</p>
        <a href="index.html" class="btn-explorar">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.898 2.344-3.172M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.898-2.344-3.172"/>
          </svg>
          Explorar mascotas
        </a>
      </div>`;
    return;
  }

  const idLabel = p => p.identifierType==='ruac' ? 'RUAC' : 'Folio';
  const idVal   = p => p.identifierType==='ruac' ? p.ruac  : p.folio;

  container.innerHTML = `<div class="grid">${pets.map(p => {
    const isFound = p.status==='found';
    const badgeEstado = isFound
      ? `<span class="badge-abs badge-estado-top badge-encontrado-c">Encontrado</span>`
      : `<span class="badge-abs badge-estado-top badge-perdido">Perdido</span>`;

    return `
    <div class="card" id="card-${p.id}">
      <div class="card-img" onclick="openModal('${p.id}')">
        <img src="${p.imageUrl}" alt="${p.name}" />
        ${badgeEstado}
        <span class="badge-guardada">
          <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>Guardada
        </span>
      </div>
      <div class="card-body" onclick="openModal('${p.id}')">
        <h3>${p.name}</h3>
        <code class="card-id">${idLabel(p)}: ${idVal(p)}</code>
        <p class="card-sub">${p.breed} · ${p.sex==='macho'?'Macho':'Hembra'}</p>
        <div class="card-detail">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${p.location}</span>
        </div>
        <div class="card-detail">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${formatFecha(p.incidentDate)}</span>
        </div>
        ${p.reward>0 ? `<div class="reward-strip">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>Recompensa: $${p.reward.toLocaleString('es-MX')} MXN
        </div>` : ''}
        <p class="card-desc">${p.description}</p>
      </div>
      <div class="card-actions">
        <button class="btn-ver" onclick="openModal('${p.id}')">Ver detalles</button>
        ${confirmingId===p.id
          ? `<div class="confirm-strip">
               <button class="btn-quitar" onclick="quitarPet('${p.id}')">Quitar</button>
               <button class="btn-no" onclick="cancelarConfirm()">No</button>
             </div>`
          : `<button class="btn-trash" onclick="pedirConfirm('${p.id}')" title="Quitar de guardadas">
               <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                 <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                 <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
               </svg>
             </button>`
        }
      </div>
    </div>`;
  }).join('')}</div>`;
}

function pedirConfirm(id) { confirmingId = id; render(); }
function cancelarConfirm() { confirmingId = null; render(); }
function quitarPet(id) {
  if(modalPetId===id) closeModal();
  eliminar(id);
  confirmingId = null;
  render();
  showToast('Mascota quitada de guardadas');
}

/* -------- detail modal -------- */
function openModal(id) {
  const pets = getGuardadas();
  const p = pets.find(x => x.id===id);
  if(!p) return;
  modalPetId = id;

  document.getElementById('modal-img').src = p.imageUrl;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-breed').textContent = `${p.breed} · ${p.sex==='macho'?'Macho':'Hembra'}`;

  const isFound = p.status==='found';
  const idLabel = p.identifierType==='ruac' ? 'RUAC' : 'Folio';
  const idVal   = p.identifierType==='ruac' ? p.ruac  : p.folio;

  const fields = [
    { l:'Raza', v: p.breed },
    { l:'Sexo', v: p.sex==='macho'?'Macho':'Hembra' },
    { l:'Tamaño', v: p.size || '—' },
    { l:'Peso', v: p.weight ? `${p.weight} kg` : '—' },
    { l:'Color pelaje', v: p.coatColor || '—' },
    { l:'Color ojos', v: p.eyeColor || '—' },
    { l:'Collar', v: p.collar===true?'Sí':p.collar===false?'No':'—' },
    { l:'Señas part.', v: p.specialFeatures || '—' },
  ];

  document.getElementById('modal-scroll').innerHTML = `
    <div class="modal-badges">
      <span class="mbadge mbadge-id">${idLabel}: ${idVal}</span>
      <span class="mbadge ${isFound?'mbadge-encontrado':'mbadge-perdido'}">${isFound?'Encontrado':'Perdido'}</span>
    </div>
    ${p.reward>0 ? `
    <div class="modal-reward">
      <svg width="20" height="20" fill="none" stroke="#92400e" stroke-width="2" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <div>
        <div class="amt">$${p.reward.toLocaleString('es-MX')} MXN</div>
        <div class="lbl">Recompensa ofrecida</div>
      </div>
    </div>` : ''}
    <div class="modal-section">
      <h4>Información</h4>
      <div class="info-grid">
        ${fields.map(f=>`<div class="info-item"><div class="lbl">${f.l}</div><div class="val">${f.v}</div></div>`).join('')}
      </div>
    </div>
    <div class="modal-section">
      <h4>Ubicación y fecha</h4>
      <div class="modal-row">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <span>${p.location}</span>
      </div>
      <div class="modal-row">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>${formatFecha(p.incidentDate)}</span>
      </div>
    </div>
    ${p.description ? `
    <div class="modal-section">
      <h4>Descripción</h4>
      <p class="modal-desc">${p.description}</p>
    </div>` : ''}
  `;

  document.getElementById('modal-quitar-btn').onclick = () => quitarPet(id);
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  modalPetId = null;
}
document.getElementById('modal').addEventListener('click', e => {
  if(e.target===e.currentTarget) closeModal();
});

/* -------- toast -------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

render();