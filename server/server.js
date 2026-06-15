const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;
 
const rutasPrincipales = require('../routes/routes');
 
// 👇 AQUÍ ESTÁ LA MODIFICACIÓN PARA ACEPTAR IMÁGENES PESADAS (50MB) 👇
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
 
// ─── API ─────────────────────────────────────────────────────────────────────
app.use('/api', rutasPrincipales);
 
// ─── REDIRECCIONES (arreglan rutas rotas en el HTML sin tocar el HTML) ───────
app.get('/menu_sinusuario/menu_sinusuario.html', (req, res) => {
    res.redirect('/Sin_Usuario/menu_sinusuario.html');
});
 
app.get('/Rescatador_Albergue/reporte_tecnico/reporte_tecnico.html', (req, res) => {
    res.redirect('/reporte_tecnico/reporte_tecnico.html');
});
 
app.get('/Dueño_de_Perro/mis-reportes.html', (req, res) => {
    res.redirect('/Dueño_de_Perro/mis_reportes.html');
});
 
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
 
app.listen(PORT, '0.0.0.0' , () => {
    console.log(`🚀 Servidor listo en:  http://localhost:${PORT}`);
    console.log(`👉 API disponible en:  http://localhost:${PORT}/api`);
});