const MAX = 6;
    const KEY = 'dog_alert_mascotas';

    function getMascotas() {
      try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
      catch { return []; }
    }

    function render() {
      const mascotas = getMascotas();
      const grid     = document.getElementById('grid');
      const empty    = document.getElementById('empty');
      const conteo   = document.getElementById('conteo');
      const btnNueva = document.getElementById('btn-nueva');

      conteo.textContent = `${mascotas.length} / ${MAX} registradas`;

      const lleno = mascotas.length >= MAX;
      if (lleno) {
        btnNueva.style.pointerEvents = 'none';
        btnNueva.style.opacity = '0.5';
      }

      if (mascotas.length === 0) {
        empty.style.display = 'flex';
        grid.innerHTML = '';
        return;
      }
      empty.style.display = 'none';

      const sexoBadge  = { Macho: 'badge-macho', Hembra: 'badge-hembra' };
      const tañoBadge  = { Chico: 'badge-chico', Mediano: 'badge-mediano', Grande: 'badge-grande' };

      grid.innerHTML = mascotas.map(m => `
        <div class="pet-card">
          <div class="pet-card-img">
            ${m.foto
              ? `<img src="${m.foto}" alt="${m.nombre}" />`
              : `<svg width="48" height="48" fill="none" stroke="#cbd5e1" stroke-width="1.5" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                 </svg>`}
          </div>
          <div class="pet-card-body">
            <div class="pet-card-header">
              <p class="pet-name">${m.nombre}</p>
              <div class="badges">
                <span class="badge ${sexoBadge[m.sexo] || ''}">${m.sexo}</span>
                <span class="badge ${tañoBadge[m.tamaño] || ''}">${m.tamaño}</span>
              </div>
            </div>
            <p class="pet-raza">${m.raza}</p>
            <p class="pet-meta">${m.edad} ${m.edad === 1 ? 'año' : 'años'} · ${m.peso} kg</p>
            <div class="pet-footer">
              <span class="pet-ruac">${m.ruac}</span>
              <span class="pet-fecha">${m.fechaRegistro}</span>
            </div>
          </div>
        </div>
      `).join('');

      if (!lleno) {
        const espacios = MAX - mascotas.length;
        const cell = document.createElement('a');
        cell.href = 'nueva-mascota.html';
        cell.className = 'add-cell';
        cell.innerHTML = `
          <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
          </svg>
          <span>Agregar mascota</span>
          <span>${espacios} espacio${espacios !== 1 ? 's' : ''} disponible${espacios !== 1 ? 's' : ''}</span>
        `;
        grid.appendChild(cell);
      }
    }

    render();