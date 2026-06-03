const db = require('../config/db');

// GET /api/usuarios
// Devuelve usuarios con nombre, correo y tipo (usando JOINs)
const obtenerUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                u.id_usuario,
                p.id_persona,
                p.nombre_completo,
                p.correo,
                tu.id_tipo_usuario,
                tu.tipo          AS tipo_usuario,
                a.nombre         AS alcaldia,
                ub.codigo_postal,
                ub.colonia,
                u.activo,
                u.created_at
            FROM usuario u
            JOIN persona p
                ON u.id_persona = p.id_persona
            JOIN catalogo_tipo_usuario tu
                ON u.id_tipo_usuario = tu.id_tipo_usuario
            LEFT JOIN ubicacion ub
                ON u.id_ubicacion = ub.id_ubicacion
            LEFT JOIN alcaldia a
                ON ub.id_alcaldia = a.id_alcaldia
            WHERE u.activo = 1
        `);
        res.json(rows);
    } catch (err) {
        console.error('obtenerUsuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// POST /api/usuarios
// Body: { id_persona, id_tipo_usuario, id_ubicacion? }
// Úsalo cuando ya existe la persona y solo necesitas crear el usuario
const crearUsuario = async (req, res) => {
    const { id_persona, id_tipo_usuario, id_ubicacion } = req.body;

    if (!id_persona || !id_tipo_usuario) {
        return res.status(400).json({
            error: 'Campos requeridos: id_persona, id_tipo_usuario'
        });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO usuario (id_persona, id_tipo_usuario, id_ubicacion) VALUES (?, ?, ?)',
            [id_persona, id_tipo_usuario, id_ubicacion || null]
        );
        res.status(201).json({
            message:    'Usuario creado exitosamente',
            id_usuario: result.insertId
        });
    } catch (err) {
        console.error('crearUsuario:', err);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

// PUT /api/usuarios/:id
// Body: { id_tipo_usuario?, id_ubicacion? }
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { id_tipo_usuario, id_ubicacion } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE usuario SET id_tipo_usuario = ?, id_ubicacion = ? WHERE id_usuario = ?',
            [id_tipo_usuario, id_ubicacion || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        console.error('actualizarUsuario:', err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// DELETE /api/usuarios/:id  → soft delete
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE usuario SET activo = 0 WHERE id_usuario = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario desactivado correctamente' });
    } catch (err) {
        console.error('eliminarUsuario:', err);
        res.status(500).json({ error: 'Error al desactivar usuario' });
    }
};

module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario };
