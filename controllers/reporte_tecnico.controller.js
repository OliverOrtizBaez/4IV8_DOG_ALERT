const db = require('../config/db');

// GET /api/reportes-tecnicos
const obtenerReportes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                rt.id_reporte_tecnico,
                p.nombre_completo   AS usuario,
                cf.descripcion      AS falla,
                rt.fecha_incidencia,
                rt.retroalimentacion,
                rt.atendido,
                rt.created_at
            FROM reporte_tecnico rt
            LEFT JOIN usuario u  ON rt.id_usuario = u.id_usuario
            LEFT JOIN persona p  ON u.id_persona  = p.id_persona
            JOIN catalogo_falla cf ON rt.id_falla = cf.id_falla
            ORDER BY rt.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('obtenerReportes:', err);
        res.status(500).json({ error: 'Error al obtener reportes técnicos' });
    }
};

// POST /api/reportes-tecnicos
// Body: { id_usuario?, id_falla, fecha_incidencia, retroalimentacion }
// id_usuario puede ser null si es un usuario sin sesión
const crearReporte = async (req, res) => {
    const { id_usuario, id_falla, fecha_incidencia, retroalimentacion } = req.body;

    if (!id_falla || !fecha_incidencia || !retroalimentacion) {
        return res.status(400).json({
            error: 'Campos requeridos: id_falla, fecha_incidencia, retroalimentacion'
        });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO reporte_tecnico (id_usuario, id_falla, fecha_incidencia, retroalimentacion) VALUES (?, ?, ?, ?)',
            [id_usuario || null, id_falla, fecha_incidencia, retroalimentacion]
        );
        res.status(201).json({
            message:              'Reporte técnico enviado',
            id_reporte_tecnico:   result.insertId
        });
    } catch (err) {
        console.error('crearReporte:', err);
        res.status(500).json({ error: 'Error al crear reporte técnico' });
    }
};

// PUT /api/reportes-tecnicos/:id
// Solo permite marcar el reporte como atendido (campo de soporte)
const actualizarReporte = async (req, res) => {
    const { id } = req.params;
    const { atendido } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE reporte_tecnico SET atendido = ? WHERE id_reporte_tecnico = ?',
            [atendido ? 1 : 0, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reporte técnico no encontrado' });
        }
        res.json({ message: 'Reporte técnico actualizado' });
    } catch (err) {
        console.error('actualizarReporte:', err);
        res.status(500).json({ error: 'Error al actualizar reporte técnico' });
    }
};

// DELETE /api/reportes-tecnicos/:id  → hard delete (no tiene campo activo)
const eliminarReporte = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM reporte_tecnico WHERE id_reporte_tecnico = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reporte técnico no encontrado' });
        }
        res.json({ message: 'Reporte técnico eliminado' });
    } catch (err) {
        console.error('eliminarReporte:', err);
        res.status(500).json({ error: 'Error al eliminar reporte técnico' });
    }
};

module.exports = { obtenerReportes, crearReporte, actualizarReporte, eliminarReporte };
