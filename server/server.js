const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// ─── 1. RUTAS ────────────────────────────────────────────────────────────────
// CORRECCIÓN: server.js está dentro de /server/, por eso el path era incorrecto.
// Sube un nivel (..) para llegar a la raíz del proyecto y luego a /routes/
const rutasPrincipales = require('../routes/routes');

// ─── 2. MIDDLEWARES ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 3. ARCHIVOS ESTÁTICOS ────────────────────────────────────────────────────
// Sube un nivel para salir de /server/ y apuntar a /public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── 4. RUTAS DE LA API ───────────────────────────────────────────────────────
app.use('/api', rutasPrincipales);

// ─── 5. RUTA RAÍZ ─────────────────────────────────────────────────────────────
// Redirige a la página principal (sin sesión iniciada)
app.get('/', (req, res) => {
    res.redirect('/Sin_Usuario/menu_sinusuario.html');
});

// ─── 6. MANEJADOR 404 ─────────────────────────────────────────────────────────
// Se ejecuta si ninguna ruta anterior coincide
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// ─── 7. MANEJADOR DE ERRORES GENERALES (500) ──────────────────────────────────
// Debe tener los 4 parámetros (err, req, res, next) para que Express lo reconozca
app.use((err, req, res, next) => {
    console.error('❌ Error interno:', err.stack);
    res.status(500).sendFile(path.join(__dirname, '500.html'));
});

// ─── 8. INICIAR SERVIDOR ──────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en:  http://localhost:${PORT}`);
    console.log(`👉 API disponible en:  http://localhost:${PORT}/api`);
});
