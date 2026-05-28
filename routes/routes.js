const express = require('express');
const router = express.Router();

/**
 * IMPORTACIÓN DE CONTROLADORES
 * (Deberás crear un controlador para cada uno de estos en src/controllers/)
 */
const personaController = require('../controllers/persona.controller');
const usuarioController = require('../controllers/usuario.controller');
const mascotaController = require('../controllers/mascota.controller');
const reporteAlertaController = require('../controllers/reporte_alerta.controller');
const reporteTecnicoController = require('../controllers/reporte_tecnico.controller');
const ubicacionController = require('../controllers/ubicacion.controller');
const catalogosController = require('../controllers/catalogos.controller');

// ==========================================
// 👤 1. ENTIDAD: PERSONAS (Credenciales y datos base)
// ==========================================
router.get('/personas', personaController.obtenerPersonas);
router.post('/personas', personaController.crearPersona);
router.put('/personas/:id', personaController.actualizarPersona);
router.delete('/personas/:id', personaController.eliminarPersona);

// ==========================================
// 👥 2. ENTIDAD: USUARIOS (Relación Persona -> Rol -> Ubicación)
// ==========================================
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.post('/usuarios', usuarioController.crearUsuario);
router.put('/usuarios/:id', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

// ==========================================
// 🐾 3. ENTIDAD: MASCOTAS (Perfil del canino)
// ==========================================
router.get('/mascotas', mascotaController.obtenerMascotas);
router.post('/mascotas', mascotaController.crearMascota);
router.put('/mascotas/:id', mascotaController.actualizarMascota);
router.delete('/mascotas/:id', mascotaController.eliminarMascota);

// ==========================================
// 🚨 4. ENTIDAD: REPORTES DE ALERTA (Extravíos)
// ==========================================
router.get('/alertas', reporteAlertaController.obtenerAlertas);
router.post('/alertas', reporteAlertaController.crearAlerta);
router.put('/alertas/:id', reporteAlertaController.actualizarAlerta);
router.delete('/alertas/:id', reporteAlertaController.eliminarAlerta);

// ==========================================
// 🛠️ 5. ENTIDAD: REPORTES TÉCNICOS (Fallas en la app)
// ==========================================
router.get('/reportes-tecnicos', reporteTecnicoController.obtenerReportes);
router.post('/reportes-tecnicos', reporteTecnicoController.crearReporte);
router.put('/reportes-tecnicos/:id', reporteTecnicoController.actualizarReporte);
router.delete('/reportes-tecnicos/:id', reporteTecnicoController.eliminarReporte);

// ==========================================
// 📍 6. ENTIDAD: UBICACIONES (Direcciones)
// ==========================================
router.get('/ubicaciones', ubicacionController.obtenerUbicaciones);
router.post('/ubicaciones', ubicacionController.crearUbicacion);
router.put('/ubicaciones/:id', ubicacionController.actualizarUbicacion);
router.delete('/ubicaciones/:id', ubicacionController.eliminarUbicacion);

// ==========================================
// 📚 7. CATÁLOGOS (Generalmente solo ocupas el GET para llenar listas desplegables)
// ==========================================
// Alcaldías
router.get('/catalogos/alcaldias', catalogosController.obtenerAlcaldias);
// Características Físicas del Canino
router.get('/catalogos/razas', catalogosController.obtenerRazas);
router.get('/catalogos/colores-pelaje', catalogosController.obtenerColoresPelaje);
router.get('/catalogos/tipos-pelaje', catalogosController.obtenerTiposPelaje);
router.get('/catalogos/tamanos', catalogosController.obtenerTamanos);
router.get('/catalogos/ojos', catalogosController.obtenerOjos);
// Tipos del Sistema
router.get('/catalogos/tipos-usuario', catalogosController.obtenerTiposUsuario);
router.get('/catalogos/fallas', catalogosController.obtenerFallas);


module.exports = router;