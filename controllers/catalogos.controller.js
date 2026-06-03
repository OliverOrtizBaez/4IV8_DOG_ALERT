const db = require('../config/db');

// Los catálogos son datos de referencia que solo se leen.
// Se usan para llenar <select> en los formularios del frontend.

// GET /api/catalogos/alcaldias
const obtenerAlcaldias = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM alcaldia ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener alcaldías' });
    }
};

// GET /api/catalogos/razas
const obtenerRazas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catalogo_raza ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener razas' });
    }
};

// GET /api/catalogos/colores-pelaje
const obtenerColoresPelaje = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catalogo_pelaje ORDER BY color');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener colores de pelaje' });
    }
};

// GET /api/catalogos/tipos-pelaje
const obtenerTiposPelaje = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catalogo_tipo_pelaje ORDER BY tipo');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tipos de pelaje' });
    }
};

// GET /api/catalogos/tamanos
const obtenerTamanos = async (req, res) => {
    try {
        // Ordenar por id para respetar el orden: miniatura < chico < mediano < grande < gigante
        const [rows] = await db.query('SELECT * FROM catalogo_tamano ORDER BY id_tamano');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tamaños' });
    }
};

// GET /api/catalogos/ojos
const obtenerOjos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catalogo_ojos ORDER BY color');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener colores de ojos' });
    }
};

// GET /api/catalogos/tipos-usuario
const obtenerTiposUsuario = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catalogo_tipo_usuario ORDER BY id_tipo_usuario');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tipos de usuario' });
    }
};

// GET /api/catalogos/fallas
const obtenerFallas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catalogo_falla ORDER BY id_falla');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tipos de falla' });
    }
};

module.exports = {
    obtenerAlcaldias,
    obtenerRazas,
    obtenerColoresPelaje,
    obtenerTiposPelaje,
    obtenerTamanos,
    obtenerOjos,
    obtenerTiposUsuario,
    obtenerFallas
};
