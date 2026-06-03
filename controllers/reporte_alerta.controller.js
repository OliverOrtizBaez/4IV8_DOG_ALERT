const db = require('../config/db');

// GET /api/alertas
// Devuelve alertas activas con datos de la mascota, dueño y ubicación
const obtenerAlertas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ra.id_reporte_alerta,
                m.id_mascota,
                m.nombre         AS mascota,
                m.ruac,
                pers.nombre_completo AS dueno,
                al.nombre        AS alcaldia,
                ub.codigo_postal,
                ub.colonia,
                ub.calle,
                ra.esta_validado,
                ra.recompensa,
                ra.comentarios,
                ra.fecha_expedicion,
                ra.fecha_caducidad,
                ra.activo,
                ra.created_at
            FROM reporte_alerta ra
            JOIN mascota m  ON ra.id_mascota            = m.id_mascota
            JOIN usuario u  ON m.id_usuario             = u.id_usuario
            JOIN persona pers ON u.id_persona           = pers.id_persona
            JOIN ubicacion ub ON ra.id_ubicacion_extravio = ub.id_ubicacion
            JOIN alcaldia al  ON ub.id_alcaldia          = al.id_alcaldia
            WHERE ra.activo = 1
            ORDER BY ra.fecha_expedicion DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('obtenerAlertas:', err);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};

// POST /api/alertas
// Body: { id_mascota, id_ubicacion_extravio, recompensa?, comentarios?,
//         fecha_expedicion, fecha_caducidad? }
const crearAlerta = async (req, res) => {
    const {
        id_mascota, id_ubicacion_extravio,
        recompensa, comentarios,
        fecha_expedicion, fecha_caducidad
    } = req.body;

    if (!id_mascota || !id_ubicacion_extravio || !fecha_expedicion) {
        return res.status(400).json({
            error: 'Campos requeridos: id_mascota, id_ubicacion_extravio, fecha_expedicion'
        });
    }
    try {
        const [result] = await db.query(`
            INSERT INTO reporte_alerta
                (id_mascota, id_ubicacion_extravio, recompensa, comentarios,
                 fecha_expedicion, fecha_caducidad)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            id_mascota,
            id_ubicacion_extravio,
            recompensa       || 0.00,
            comentarios      || null,
            fecha_expedicion,
            fecha_caducidad  || null
        ]);
        res.status(201).json({
            message:           'Alerta creada exitosamente',
            id_reporte_alerta: result.insertId
        });
    } catch (err) {
        console.error('crearAlerta:', err);
        res.status(500).json({ error: 'Error al crear alerta' });
    }
};

// PUT /api/alertas/:id
// Permite marcar como validada, actualizar recompensa, comentarios o caducidad
const actualizarAlerta = async (req, res) => {
    const { id } = req.params;
    const { esta_validado, recompensa, comentarios, fecha_caducidad, activo } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE reporte_alerta SET
                esta_validado  = ?,
                recompensa     = ?,
                comentarios    = ?,
                fecha_caducidad= ?,
                activo         = ?
            WHERE id_reporte_alerta = ?
        `, [
            esta_validado ? 1 : 0,
            recompensa,
            comentarios     || null,
            fecha_caducidad || null,
            activo          !== undefined ? (activo ? 1 : 0) : 1,
            id
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }
        res.json({ message: 'Alerta actualizada correctamente' });
    } catch (err) {
        console.error('actualizarAlerta:', err);
        res.status(500).json({ error: 'Error al actualizar alerta' });
    }
};

// DELETE /api/alertas/:id  → soft delete
const eliminarAlerta = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE reporte_alerta SET activo = 0 WHERE id_reporte_alerta = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }
        res.json({ message: 'Alerta desactivada correctamente' });
    } catch (err) {
        console.error('eliminarAlerta:', err);
        res.status(500).json({ error: 'Error al desactivar alerta' });
    }
};

module.exports = { obtenerAlertas, crearAlerta, actualizarAlerta, eliminarAlerta };
