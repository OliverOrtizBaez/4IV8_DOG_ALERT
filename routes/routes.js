// routes/routes.js

const express = require('express');
const router  = express.Router();

// Controladores
const authController          = require('../controllers/auth.controller');
const personaController       = require('../controllers/persona.controller');
const usuarioController       = require('../controllers/usuario.controller');
const mascotaController       = require('../controllers/mascota.controller');
const reporteAlertaController = require('../controllers/reporte_alerta.controller');
const reporteTecnicoController= require('../controllers/reporte_tecnico.controller');
const ubicacionController     = require('../controllers/ubicacion.controller');
const catalogosController     = require('../controllers/catalogos.controller');


// ─── AUTH ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login    → inicia sesión
// POST /api/auth/register → crea persona + usuario en una transacción
router.post('/auth/login',    authController.login);
router.post('/auth/register', authController.register);


// ─── PERSONAS ─────────────────────────────────────────────────────────────────
router.get   ('/personas',     personaController.obtenerPersonas);
router.post  ('/personas',     personaController.crearPersona);
router.put   ('/personas/:id', personaController.actualizarPersona);
router.delete('/personas/:id', personaController.eliminarPersona);


// ─── USUARIOS ─────────────────────────────────────────────────────────────────
router.get   ('/usuarios',     usuarioController.obtenerUsuarios);
router.post  ('/usuarios',     usuarioController.crearUsuario);
router.put   ('/usuarios/:id', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);


// ─── MASCOTAS ─────────────────────────────────────────────────────────────────
router.get   ('/mascotas',     mascotaController.obtenerMascotas);
router.post  ('/mascotas',     mascotaController.crearMascota);
router.put   ('/mascotas/:id', mascotaController.actualizarMascota);
router.delete('/mascotas/:id', mascotaController.eliminarMascota);


// ─── REPORTES DE ALERTAS (EXTRAVÍOS) ──────────────────────────────────────────
router.get   ('/alertas',     reporteAlertaController.obtenerAlertas);
router.post  ('/alertas',     reporteAlertaController.crearAlerta);
router.put   ('/alertas/:id', reporteAlertaController.actualizarAlerta);
router.delete('/alertas/:id', reporteAlertaController.eliminarAlerta);


// ─── REPORTES TÉCNICOS ────────────────────────────────────────────────────────
router.get   ('/reportes-tecnicos',     reporteTecnicoController.obtenerReportes);
router.post  ('/reportes-tecnicos',     reporteTecnicoController.crearReporte);
router.put   ('/reportes-tecnicos/:id', reporteTecnicoController.actualizarReporte);
router.delete('/reportes-tecnicos/:id', reporteTecnicoController.eliminarReporte);


// ─── UBICACIONES ──────────────────────────────────────────────────────────────
router.get   ('/ubicaciones',     ubicacionController.obtenerUbicaciones);
router.post  ('/ubicaciones',     ubicacionController.crearUbicacion);
router.put   ('/ubicaciones/:id', ubicacionController.actualizarUbicacion);
router.delete('/ubicaciones/:id', ubicacionController.eliminarUbicacion);


// ─── CATÁLOGOS (solo lectura, no se modifican desde el frontend) ──────────────
router.get('/catalogos/alcaldias',     catalogosController.obtenerAlcaldias);
router.get('/catalogos/razas',         catalogosController.obtenerRazas);
router.get('/catalogos/colores-pelaje',catalogosController.obtenerColoresPelaje);
router.get('/catalogos/tipos-pelaje',  catalogosController.obtenerTiposPelaje);
router.get('/catalogos/tamanos',       catalogosController.obtenerTamanos);
router.get('/catalogos/ojos',          catalogosController.obtenerOjos);
router.get('/catalogos/tipos-usuario', catalogosController.obtenerTiposUsuario);
router.get('/catalogos/fallas',        catalogosController.obtenerFallas);

module.exports = router;