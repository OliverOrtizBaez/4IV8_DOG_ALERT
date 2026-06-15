document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. VERIFICACIÓN DE SESIÓN
  // ==========================================================================
  const idUsuario = localStorage.getItem('id_usuario') || sessionStorage.getItem('id_usuario');
  if (!idUsuario) {
    console.warn("Usuario no autenticado. Redirigiendo...");
    window.location.href = '/Sin_Usuario/menu_sinusuario.html';
    return;
  }

  // Objeto para guardar el estado de los botones personalizados y foto
  const state = {
    ruac: null,
    sexo: null,
    tamano: null,
    collar: null,
    fotoBase64: null
  };

  // ==========================================================================
  // 2. LÓGICA DEL PASO 1 (RUAC)
  // ==========================================================================
  const ruacInput = document.getElementById('ruac-input');
  const ruacCount = document.getElementById('ruac-count');
  const ruacError = document.getElementById('ruac-error');
  const btnVerificar = document.getElementById('btn-verificar');

  if (ruacInput) {
    ruacInput.addEventListener('input', function () {
      // Forzar mayúsculas y remover símbolos
      let val = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      // Limitar a 10 exactos
      if (val.length > 10) val = val.slice(0, 10);
      this.value = val;
      
      // Actualizar contador
      if (ruacCount) ruacCount.textContent = `${val.length}/10`;

      // Mostrar error dinámico si empezó a escribir pero no llegó a 10
      if (val.length > 0 && val.length < 10) {
        ruacError.textContent = 'El RUAC debe tener exactamente 10 caracteres.';
        ruacError.classList.remove('hidden');
      } else {
        ruacError.classList.add('hidden');
      }
    });
  }

  if (btnVerificar) {
    btnVerificar.addEventListener('click', () => {
      const val = ruacInput.value;
      
      if (val.length > 0 && val.length < 10) {
        alert('Si proporcionas un RUAC, este debe tener exactamente 10 caracteres.');
        return;
      }

      state.ruac = val.length === 10 ? val : null;

      // --- TRANSICIÓN AL PASO 2 ---
      document.getElementById('paso1').style.display = 'none';
      document.getElementById('paso2').classList.remove('hidden');

      // Actualizar barra superior (Puntos e Indicadores)
      document.getElementById('dot1').classList.remove('active');
      document.getElementById('dot2').classList.add('active');
      document.getElementById('header-sub').textContent = 'Paso 2 de 2';
      document.getElementById('header-title').textContent = 'Datos de la Mascota';

      // Mostrar placa verde de éxito si ingresó el RUAC
      if (state.ruac) {
        document.getElementById('ruac-ok-text').textContent = state.ruac;
      } else {
        document.getElementById('ruac-ok-badge').style.display = 'none';
      }
    });
  }

  // ==========================================================================
  // 3. LÓGICA DEL PASO 2 (Formulario Dinámico)
  // ==========================================================================

  // --- A. Contadores de caracteres ---
  const setCounter = (inputId, countId, max) => {
    const input = document.getElementById(inputId);
    const count = document.getElementById(countId);
    if (input && count) {
      input.addEventListener('input', () => {
        count.textContent = `${input.value.length}/${max}`;
      });
    }
  };
  setCounter('nombre', 'nombre-count', 20);
  setCounter('señas', 'señas-count', 40);

  // --- B. Botones tipo "Toggle" (Sexo, Tamaño, Collar) ---
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const group = btn.getAttribute('data-group');
      const val = btn.getAttribute('data-value');
      const customClass = btn.getAttribute('data-class') || 'active'; // Para los colores azul/rosa

      // Quitar clase activa a todos los hermanos del mismo grupo
      document.querySelectorAll(`.toggle-btn[data-group="${group}"]`).forEach(sibling => {
        const sibClass = sibling.getAttribute('data-class') || 'active';
        sibling.classList.remove(sibClass);
        sibling.classList.remove('active'); // Por si acaso
      });

      // Añadir clase activa al presionado
      btn.classList.add(customClass);
      if (!btn.getAttribute('data-class')) btn.classList.add('active');

      // Guardar el estado en nuestra variable
      if (group === 'sexo') state.sexo = val;
      if (group === 'tamano') state.tamano = val;
      if (group === 'collar') state.collar = val;
    });
  });

  // --- C. Subida de Foto (Visualización y Base64) ---
  const btnUpload = document.getElementById('btn-upload');
  const fotoInput = document.getElementById('foto-input');
  const fotoWrap = document.getElementById('foto-preview-wrap');
  const fotoPreview = document.getElementById('foto-preview');
  const btnRemove = document.getElementById('btn-foto-remove');

  if (btnUpload && fotoInput) {
    btnUpload.addEventListener('click', () => fotoInput.click());

    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Límite de 10 MB
      if (file.size > 10 * 1024 * 1024) {
        alert("La imagen es muy pesada. El máximo es 10 MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        state.fotoBase64 = evt.target.result;
        fotoPreview.src = evt.target.result;
        
        // Ocultar botón de subida y mostrar cuadro de foto
        btnUpload.classList.add('hidden');
        fotoWrap.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      fotoInput.value = '';
      state.fotoBase64 = null;
      fotoWrap.classList.add('hidden');
      btnUpload.classList.remove('hidden');
    });
  }

  // ==========================================================================
  // 4. GUARDADO FINAL (Validación e Inserción en Base de Datos)
  // ==========================================================================
  const btnGuardar = document.getElementById('btn-guardar');
  const formError = document.getElementById('form-error');

  if (btnGuardar) {
    btnGuardar.addEventListener('click', async (e) => {
      e.preventDefault();
      formError.classList.add('hidden'); // Ocultar errores previos

      // Captura de valores de los inputs tradicionales y selectores
      const nombre = document.getElementById('nombre').value.trim();
      const fechaNac = document.getElementById('fecha_nacimiento').value;
      const peso = document.getElementById('peso').value;
      const idRaza = document.getElementById('id_raza').value;
      const idTipoPelaje = document.getElementById('id_tipo_pelaje').value;
      const idOjos = document.getElementById('id_ojos').value;
      const idColorPelaje = document.getElementById('id_pelaje').value;
      const senas = document.getElementById('señas').value.trim();

      // Validación rígida obligatoria
      if (!nombre || !fechaNac || !peso || !idRaza || !idTipoPelaje || !idOjos || !idColorPelaje || !state.sexo || !state.tamano || !state.collar || !state.fotoBase64) {
        formError.textContent = 'Por favor, llena todos los campos, selecciona los botones requeridos y sube la foto obligatoria.';
        formError.classList.remove('hidden');
        // Hacer scroll automático al error
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        return;
      }

      // Estructura JSON mapeada milimétricamente para tu backend MySQL
      const mascotaData = {
        id_usuario: parseInt(idUsuario, 10),
        ruac: state.ruac, // Nulo o de 10 caracteres
        nombre: nombre,
        fecha_nacimiento: fechaNac,
        peso: parseFloat(peso),
        sexo: state.sexo, // 'Macho' o 'Hembra'
        id_tamano: parseInt(state.tamano, 10), // Del 1 al 5
        id_raza: parseInt(idRaza, 10),
        id_tipo_pelaje: parseInt(idTipoPelaje, 10),
        id_ojos: parseInt(idOjos, 10),
        id_pelaje: parseInt(idColorPelaje, 10),
        senas_particulares: senas,
        collar: parseInt(state.collar, 10), // 1 (Sí) o 0 (No)
        foto: state.fotoBase64
      };

      try {
        // Bloqueamos el botón para evitar registros duplicados
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = 'Guardando datos...';

        // Petición al Servidor Node.js
        const respuesta = await fetch('/api/mascotas/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mascotaData)
        });
        
        const resultado = await respuesta.json();

        if (respuesta.ok) {
          alert('¡Mascota registrada exitosamente!');
          window.location.href = './registrar_mascota.html';
        } else {
          // Extraemos los errores exactos que manda tu middleware validador.js
          const mensajeValidacion = resultado.errores 
            ? resultado.errores.map(e => e.msg).join('\n') 
            : resultado.mensaje || 'Ocurrió un error en el servidor al guardar la mascota.';

          // Mostramos la alerta real de rechazo
          alert("Bloqueo de seguridad o validación:\n" + mensajeValidacion);

          // Mostramos el texto rojo abajo del botón
          formError.textContent = mensajeValidacion;
          formError.classList.remove('hidden');
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg> Finalizar registro`;
        }
      } catch (err) {
        console.error('Error de conexión:', err);
        
        // Guardado de emergencia en el LocalStorage si Express falla
        let locales = JSON.parse(localStorage.getItem('dog_alert_mascotas') || '[]');
        mascotaData.id = 'm' + Date.now();
        mascotaData.fechaRegistro = new Date().toLocaleDateString('es-MX');
        locales.push(mascotaData);
        localStorage.setItem('dog_alert_mascotas', JSON.stringify(locales));

        alert('Servidor desconectado. Guardado temporalmente en tu navegador.');
        window.location.href = './registrar_mascota.html';
      }
    });
  }
});