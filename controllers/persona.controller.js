const db     = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/personas
// Nunca devolvemos contrasena_hash
const obtenerPersonas = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id_persona, nombre_completo, correo, activo, created_at, updated_at FROM persona'
        );
        res.json(rows);
    } catch (err) {
        console.error('obtenerPersonas:', err);
        res.status(500).json({ error: 'Error al obtener personas' });
    }
};

// POST /api/personas
// Body: { nombre_completo, correo, contrasena }
const crearPersona = async (req, res) => {
    const { nombre_completo, correo, contrasena } = req.body;

    if (!nombre_completo || !correo || !contrasena) {
        return res.status(400).json({
            error: 'Campos requeridos: nombre_completo, correo, contrasena'
        });
    }
    try {
        const contrasena_hash = await bcrypt.hash(contrasena, 10);
        const [result] = await db.query(
            'INSERT INTO persona (nombre_completo, correo, contrasena_hash) VALUES (?, ?, ?)',
            [nombre_completo, correo, contrasena_hash]
        );
        res.status(201).json({
            message:    'Persona creada exitosamente',
            id_persona: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        console.error('crearPersona:', err);
        res.status(500).json({ error: 'Error al crear persona' });
    }
};

// PUT /api/personas/:id
// Body: { nombre_completo, correo }
const actualizarPersona = async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, correo } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE persona SET nombre_completo = ?, correo = ? WHERE id_persona = ?',
            [nombre_completo, correo, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        res.json({ message: 'Persona actualizada correctamente' });
    } catch (err) {
        console.error('actualizarPersona:', err);
        res.status(500).json({ error: 'Error al actualizar persona' });
    }
};

// DELETE /api/personas/:id  → soft delete (activo = 0)
// No borramos el registro; la tabla usuario depende de persona con ON DELETE CASCADE
const eliminarPersona = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE persona SET activo = 0 WHERE id_persona = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        res.json({ message: 'Persona desactivada correctamente' });
    } catch (err) {
        console.error('eliminarPersona:', err);
        res.status(500).json({ error: 'Error al desactivar persona' });
    }
};

module.exports = { obtenerPersonas, crearPersona, actualizarPersona, eliminarPersona };
