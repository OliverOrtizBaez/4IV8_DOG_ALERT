const KEY = 'dog_alert_reportes';

/* ---------- helpers ---------- */
function getReportes() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    const hoy = Date.now();
    const vigentes = raw.filter(r => new Date(r.fechaExpiracion).getTime() > hoy);
    if (vigentes.length !== raw.length) localStorage.setItem(KEY, JSON.stringify(vigentes));
    return vigentes.sort((a,b) => new Date(a.fechaExpiracion)-new Date(b.fechaExpiracion));
  } catch { return []; }
}
function saveAll(lista) { localStorage.setItem(KEY, JSON.stringify(lista)); }
function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX',{day:'2-digit',month:'long',year:'numeric'});
}
function diasRestantes(exp) {
  const diff = new Date(exp).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff/(1000*60*60*24)));
}
function badgeDias(dias) {
  const cls = dias<=5?'badge-dias-red':dias<=14?'badge-dias-amber':'badge-dias-green';
  return `<span class="badge ${cls}">
    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>${dias}d</span>`;
}
function badgeEstado(estado) {
  if(estado==='encontrado')
    return `<span class="badge badge-encontrado">
      <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>Encontrado</span>`;
  return `<span class="badge badge-activo">
    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>Activo</span>`;
}

/* ---------- render ---------- */
function render() {
  const content = document.getElementById('content');
  const reportes = getReportes();

  if(reportes.length===0){
    content.innerHTML = `
      <div class="empty">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.898 2.344-3.172M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.898-2.344-3.172"/>
          <path d="M8 14v.5A3.5 3.5 0 0 0 11.5 18h1a3.5 3.5 0 0 0 3.5-3.5V14M8 14H6c-.375 0-1.125-.5-1-1.5.5-4 3.13-5 5-5h4c1.87 0 4.5 1 5 5 .125 1-1.5 1.5-1 1.5h-2"/>
          <circle cx="10.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="13.5" cy="10.5" r=".5" fill="currentColor"/>
        </svg>
        <p class="title">Sin reportes activos</p>
        <p class="sub">Cuando crees un reporte de pérdida aparecerá aquí.</p>
        <a href="crear_reporte.html" class="btn-crear">
          Crear reporte
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>
      </div>`;
    return;
  }

  content.innerHTML = reportes.map(r => {
    const dias = diasRestantes(r.fechaExpiracion);
    const thumbHtml = r.mascotaFoto
      ? `<div class="pet-thumb"><img src="${r.mascotaFoto}" alt="${r.mascotaNombre}"/></div>`
      : `<div class="pet-thumb" style="background:#f1f5f9">
           <svg class="pet-thumb-icon" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
             <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.898 2.344-3.172M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.898-2.344-3.172"/>
           </svg>
         </div>`;
    const btnEncontrado = r.estado==='activo' ? `
      <button class="btn-action btn-encontrado" onclick="abrirModal('encontrado','${r.id}')">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>Encontrado
      </button>` : '';
    return `
    <div class="card" id="card-${r.id}">
      <div class="card-head">
        ${thumbHtml}
        <div class="head-info">
          <div class="head-top">
            <span class="pet-name">${r.mascotaNombre}</span>
            ${badgeEstado(r.estado)}
          </div>
          <p class="pet-sub">${r.mascotaRaza} · RUAC ${r.ruac}</p>
        </div>
        ${badgeDias(dias)}
      </div>
      <div class="card-details">
        <div class="detail-row">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Hecho el ${formatFecha(r.fechaHechos)}</span>
        </div>
        <div class="detail-row">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${r.ubicacion.calle}, ${r.ubicacion.colonia}, ${r.ubicacion.alcaldia}</span>
        </div>
        <div class="detail-row">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span>Expira el ${formatFecha(r.fechaExpiracion)} (${dias} días restantes)</span>
        </div>
        ${r.recompensa>0 ? `<div class="detail-row reward-pill">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Recompensa: $${r.recompensa.toLocaleString('es-MX')} MXN
        </div>` : ''}
      </div>
      ${r.resumen ? `<p class="card-resumen">"${r.resumen}"</p>` : ''}
      <div class="card-actions">
        ${btnEncontrado}
        <button class="btn-action btn-restablecer" onclick="abrirModal('restablecer','${r.id}')">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
          </svg>Restablecer
        </button>
        <button class="btn-action btn-eliminar" onclick="abrirModal('eliminar','${r.id}')">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>Eliminar
        </button>
      </div>
    </div>`;
  }).join('');
}

/* ---------- modal ---------- */
let modalAccion = null;

const MODAL_CFG = {
  eliminar: {
    icon: `<svg width="32" height="32" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>`,
    titulo: 'Eliminar reporte',
    msg: r => `¿Seguro que quieres eliminar el reporte de ${r.mascotaNombre}? Esta acción no se puede deshacer.`,
    color: '#ef4444', label: 'Sí, eliminar',
  },
  encontrado: {
    icon: `<svg width="32" height="32" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    titulo: 'Marcar como encontrado',
    msg: r => `¿${r.mascotaNombre} ya fue encontrado? El reporte se cerrará y se eliminará al vencer su fecha.`,
    color: '#10b981', label: 'Sí, fue encontrado',
  },
  restablecer: {
    icon: `<svg width="32" height="32" fill="none" stroke="#0ea5e9" stroke-width="2" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>`,
    titulo: 'Restablecer reporte',
    msg: r => `El reporte de ${r.mascotaNombre} se extenderá 60 días más a partir de hoy.`,
    color: '#0ea5e9', label: 'Restablecer',
  },
};

function abrirModal(tipo, id) {
  const reportes = getReportes();
  const r = reportes.find(x => x.id===id);
  if(!r) return;
  modalAccion = { tipo, id };
  const cfg = MODAL_CFG[tipo];
  document.getElementById('modal-icon').innerHTML = cfg.icon;
  document.getElementById('modal-title').textContent = cfg.titulo;
  document.getElementById('modal-msg').textContent = cfg.msg(r);
  const btn = document.getElementById('modal-confirm-btn');
  btn.textContent = cfg.label;
  btn.style.background = cfg.color;
  document.getElementById('modal').classList.add('open');
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  modalAccion = null;
}
document.getElementById('modal').addEventListener('click', e => {
  if(e.target===e.currentTarget) closeModal();
});
document.getElementById('modal-confirm-btn').addEventListener('click', confirmar);

function confirmar() {
  if(!modalAccion) return;
  const { tipo, id } = modalAccion;
  let lista = getReportes();
  let msg = '';

  if(tipo==='eliminar') {
    lista = lista.filter(r => r.id!==id);
    msg = 'Reporte eliminado';
  } else if(tipo==='encontrado') {
    lista = lista.map(r => r.id===id ? {...r, estado:'encontrado'} : r);
    msg = '¡Marcado como encontrado!';
  } else if(tipo==='restablecer') {
    const exp = new Date();
    exp.setDate(exp.getDate()+60);
    lista = lista.map(r => r.id===id ? {...r, fechaExpiracion:exp.toISOString(), estado:'activo'} : r);
    msg = 'Reporte restablecido por 60 días más';
  }

  saveAll(lista);
  closeModal();
  render();
  showToast(msg);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

render();