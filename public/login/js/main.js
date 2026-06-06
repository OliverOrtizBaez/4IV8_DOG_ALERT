const passInput   = document.getElementById('password');
const toggleBtn   = document.getElementById('toggle-pass');
const iconEye     = document.getElementById('icon-eye');
const iconEyeOff  = document.getElementById('icon-eye-off');

if (toggleBtn) {
  toggleBtn.addEventListener('click', function () {
    const visible = passInput.type === 'text';
    passInput.type = visible ? 'password' : 'text';
    if (iconEye) iconEye.style.display    = visible ? 'block' : 'none';
    if (iconEyeOff) iconEyeOff.style.display = visible ? 'none'  : 'block';
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value;
    const errorEl   = document.getElementById('error-msg');
    const btnSubmit = document.querySelector('button[type="submit"]') || document.getElementById('btn-submit');

    if (errorEl) errorEl.textContent = '';

    if (!email || !password) {
      if (errorEl) errorEl.textContent = 'Por favor, llena todos los campos.';
      return;
    }

    try {
      if (btnSubmit) btnSubmit.disabled = true;
      if (errorEl) {
        errorEl.style.color = '#64748b';
        errorEl.textContent = 'Verificando credenciales...';
      }

      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasena: password })
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        console.log("Logeo exitoso. Guardando datos...");
        if (errorEl) {
          errorEl.style.color = '#10b981';
          errorEl.textContent = '¡Inicio de sesión correcto!';
        }

        // GUARDAMOS EN AMBOS POR SI ACASO OTROS SCRIPTS USAN SESSIONSTORAGE
        localStorage.setItem('id_usuario', resultado.id_usuario);
        localStorage.setItem('nombre_usuario', resultado.nombre_completo);
        localStorage.setItem('tipo_usuario', resultado.tipo_usuario);

        sessionStorage.setItem('id_usuario', resultado.id_usuario);
        sessionStorage.setItem('nombre_usuario', resultado.nombre_completo);
        sessionStorage.setItem('tipo_usuario', resultado.tipo_usuario);

        setTimeout(() => {
          window.location.href = '/Dueno_de_Perro/menu_duenoperro.html';
        }, 1000);

      } else {
        if (btnSubmit) btnSubmit.disabled = false;
        if (errorEl) {
          errorEl.style.color = '#ef4444';
          errorEl.textContent = resultado.error || 'Correo o contraseña incorrectos.';
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (btnSubmit) btnSubmit.disabled = false;
      if (errorEl) {
        errorEl.style.color = '#ef4444';
        errorEl.textContent = 'No hay conexión con el servidor.';
      }
    }
  });
}