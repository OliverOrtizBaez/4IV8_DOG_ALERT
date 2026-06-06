const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;
 
const rutasPrincipales = require('../routes/routes');
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
 
// ─── API ─────────────────────────────────────────────────────────────────────
app.use('/api', rutasPrincipales);
 
// ─── REDIRECCIONES (arreglan rutas rotas en el HTML sin tocar el HTML) ───────
 
// login.html y sing_in.html usan "../menu_sinusuario/menu_sinusuario.html"
// pero la carpeta se llama Sin_Usuario
app.get('/menu_sinusuario/menu_sinusuario.html', (req, res) => {
    res.redirect('/Sin_Usuario/menu_sinusuario.html');
});
 
// menu_rescaoalber.html usa "./reporte_tecnico/reporte_tecnico.html"
// que resuelve a /Rescatador_Albergue/reporte_tecnico/reporte_tecnico.html (no existe)
app.get('/Rescatador_Albergue/reporte_tecnico/reporte_tecnico.html', (req, res) => {
    res.redirect('/reporte_tecnico/reporte_tecnico.html');
});
 
// crear-reporte.html éxito usa "mis-reportes.html" (con guión) en vez de mis_reportes.html
app.get('/Dueño_de_Perro/mis-reportes.html', (req, res) => {
    res.redirect('/Dueño_de_Perro/mis_reportes.html');
});
 
// crear-reporte.html éxito usa "registrar-mascota.html" (con guión)
app.get('/Dueño_de_Perro/registrar-mascota.html', (req, res) => {
    res.redirect('/Dueño_de_Perro/registrar_mascota.html');
});
 
// ─── RUTA RAÍZ ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.redirect('/Sin_Usuario/menu_sinusuario.html');
});
 
// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});
 
// ─── 500 ─────────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Error interno:', err.stack);
    res.status(500).sendFile(path.join(__dirname, '500.html'));
});
 
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en:  http://localhost:${PORT}`);
    console.log(`👉 API disponible en:  http://localhost:${PORT}/api`);
});