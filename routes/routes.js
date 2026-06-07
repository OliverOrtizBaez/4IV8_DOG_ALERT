// routes/routes.js

const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// ─── CONFIGURACIÓN DE MULTER PARA FOTOS DE PERFIL ─────────────────────────────
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo no es una imagen válida'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } 
});


// ─── SISTEMA AUTOMÁTICO DE CARGA DE CONTROLADORES ─────────────────────────────
// Esta función busca dinámicamente el archivo en tu carpeta bajo diferentes formatos
function cargarControlador(nombreBase) {
    const posiblesNombres = [
        `${nombreBase}.controller.js`,                                                // ej: reporte_alerta.controller.js
        `${nombreBase.replace(/_/g, '-')}.controller.js`,                             // ej: reporte-alerta.controller.js
        `${nombreBase.replace(/_([a-z])/g, (g) => g[1].toUpperCase())}.controller.js`, // ej: reporteAlerta.controller.js
        `${nombreBase.split('_')[0]}.controller.js`                                   // ej: reporte.controller.js
    ];

    for (const nombre of posiblesNombres) {
        const rutaCompleta = path.join(__dirname, '../controllers', nombre);
        if (fs.existsSync(rutaCompleta)) {
            return require(rutaCompleta);
        }
    }
    console.log(`⚠️ Alerta: No se encontró un archivo controlador para '${nombreBase}'`);
    return null;
}

// Vinculación dinámica de controladores
const authController           = cargarControlador('auth') || {};
const personaController        = cargarControlador('persona') || {};
const usuarioController        = cargarControlador('usuario') || {};
const mascotaController        = cargarControlador('mascota') || {};
const reporteAlertaController  = cargarControlador('reporte_alerta') || {};
const reporteTecnicoController = cargarControlador('reporte_tecnico') || {};
const ubicacionController      = cargarControlador('ubicacion') || {};
const catalogosController      = cargarControlador('catalogos') || {};

// Validador de funciones: Evita caídas si el método o archivo no existe en la carpeta
function asignarRuta(controller, metodo) {
    if (controller && typeof controller[metodo] === 'function') {
        return controller[metodo];
    }
    return (req, res) => {
        res.status(501).json({ 
            mensaje: `La función '${metodo}' no está disponible o el controlador no fue encontrado en el servidor.` 
        });
    };
}


// ─── RUTAS DE AUTENTICACIÓN (AUTH) ────────────────────────────────────────────
router.post('/auth/login',    asignarRuta(authController, 'login'));
router.post('/auth/register', asignarRuta(authController, 'register'));


// ─── RUTAS DE PERSONAS ────────────────────────────────────────────────────────
router.get   ('/personas',     asignarRuta(personaController, 'obtenerPersonas'));
router.post  ('/personas',     asignarRuta(personaController, 'crearPersona'));
router.put   ('/personas/:id', asignarRuta(personaController, 'actualizarPersona'));
router.delete('/personas/:id', asignarRuta(personaController, 'eliminarPersona'));
router.put('/personas/:id/foto', upload.single('foto'), personaController.actualizarFoto);

// Actualización de la foto de perfil usando el procesamiento de Multer
router.put('/personas/:id/foto', upload.single('foto'), asignarRuta(personaController, 'actualizarFoto'));


// ─── RUTAS DE USUARIOS ────────────────────────────────────────────────────────
router.get   ('/usuarios',     asignarRuta(usuarioController, 'obtenerUsuarios'));
router.post  ('/usuarios',     asignarRuta(usuarioController, 'crearUsuario'));
router.put   ('/usuarios/:id', asignarRuta(usuarioController, 'actualizarUsuario'));
router.delete('/usuarios/:id', asignarRuta(usuarioController, 'eliminarUsuario'));


// ─── RUTAS DE MASCOTAS ────────────────────────────────────────────────────────
router.get   ('/mascotas',     asignarRuta(mascotaController, 'obtenerMascotas'));
router.post  ('/mascotas',     asignarRuta(mascotaController, 'crearMascota'));
router.put   ('/mascotas/:id', asignarRuta(mascotaController, 'actualizarMascota'));
router.delete('/mascotas/:id', asignarRuta(mascotaController, 'eliminarMascota'));


// ─── RUTAS DE REPORTES DE ALERTA Y TÉCNICOS ────────────────────────────────────
router.get   ('/reportes-alerta',     asignarRuta(reporteAlertaController, 'obtenerReportes'));
router.post  ('/reportes-alerta',     asignarRuta(reporteAlertaController, 'crearReporte'));
router.put   ('/reportes-alerta/:id', asignarRuta(reporteAlertaController, 'actualizarReporte'));
router.delete('/reportes-alerta/:id', asignarRuta(reporteAlertaController, 'eliminarReporte'));

router.get   ('/reportes-tecnicos',     asignarRuta(reporteTecnicoController, 'obtenerReportes'));
router.post  ('/reportes-tecnicos',     asignarRuta(reporteTecnicoController, 'crearReporte'));
router.put   ('/reportes-tecnicos/:id', asignarRuta(reporteTecnicoController, 'actualizarReporte'));
router.delete('/reportes-tecnicos/:id', asignarRuta(reporteTecnicoController, 'eliminarReporte'));


// ─── RUTAS DE UBICACIONES ──────────────────────────────────────────────────────
router.get   ('/ubicaciones',     asignarRuta(ubicacionController, 'obtenerUbicaciones'));
router.post  ('/ubicaciones',     asignarRuta(ubicacionController, 'crearUbicacion'));
router.put   ('/ubicaciones/:id', asignarRuta(ubicacionController, 'actualizarUbicacion'));
router.delete('/ubicaciones/:id', asignarRuta(ubicacionController, 'eliminarUbicacion'));


// ─── RUTAS DE CATÁLOGOS ────────────────────────────────────────────────────────
router.get('/catalogos/alcaldias',      asignarRuta(catalogosController, 'obtenerAlcaldias'));
router.get('/catalogos/razas',          asignarRuta(catalogosController, 'obtenerRazas'));
router.get('/catalogos/colores-pelaje', asignarRuta(catalogosController, 'obtenerColoresPelaje'));
router.get('/catalogos/tipos-pelaje',   asignarRuta(catalogosController, 'obtenerTiposPelaje'));
router.get('/catalogos/tamanos',        asignarRuta(catalogosController, 'obtenerTamanos'));
router.get('/catalogos/ojos',           asignarRuta(catalogosController, 'obtenerOjos'));
router.get('/catalogos/tipos-usuario',  asignarRuta(catalogosController, 'obtenerTiposUsuario'));


module.exports = router;