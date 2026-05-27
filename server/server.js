const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. IMPORTAR LAS RUTAS
// Importamos el archivo de rutas que consolidamos anteriormente
const rutasPrincipales = require('./routes/routes');

// 2. MIDDLEWARES (Configuraciones previas)
// Esto es vital para que Express pueda leer los datos que envías en un POST o PUT
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. ARCHIVOS ESTÁTICOS
// Si también quieres servir tu frontend desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// 4. RUTAS DE LA API
// Todas las peticiones que empiecen con /api serán gestionadas por nuestro routes.js
app.use('/api', rutasPrincipales);

// Ruta por defecto (opcional, para cuando alguien entra a la raíz)
app.get('/', (req, res) => {
    res.send('Servidor de Alerta Canina corriendo correctamente.');
});

// 5. INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en: http://localhost:${PORT}`);
    console.log(`👉 API disponible en: http://localhost:${PORT}/api`);
});