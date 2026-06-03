const db = require('../config/db');

// GET /api/ubicaciones
const obtenerUbicaciones = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ub.id_ubicacion,
                ub.id_alcaldia,
                a.nombre  AS alcaldia,
                ub.codigo_postal,
                ub.colonia,
                ub.calle
            FROM ubicacion ub
            JOIN alcaldia a ON ub.id_alcaldia = a.id_alcaldia
            ORDER BY a.nombre, ub.colonia
        `);
        res.json(rows);
    } catch (err) {
        console.error('obtenerUbicaciones:', err);
        res.status(500).json({ error: 'Error al obtener ubicaciones' });
    }
};

// POST /api/ubicaciones
// Body: { id_alcaldia, codigo_postal, colonia?, calle? }
const crearUbicacion = async (req, res) => {
    const { id_alcaldia, codigo_postal, colonia, calle } = req.body;

    if (!id_alcaldia || !codigo_postal) {
        return res.status(400).json({
            error: 'Campos requeridos: id_alcaldia, codigo_postal'
        });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO ubicacion (id_alcaldia, codigo_postal, colonia, calle) VALUES (?, ?, ?, ?)',
            [id_alcaldia, codigo_postal, colonia || null, calle || null]
        );
        res.status(201).json({
            message:      'Ubicación registrada correctamente',
            id_ubicacion: result.insertId
        });
    } catch (err) {
        console.error('crearUbicacion:', err);
        res.status(500).json({ error: 'Error al crear ubicación' });
    }
};

// PUT /api/ubicaciones/:id
const actualizarUbicacion = async (req, res) => {
    const { id } = req.params;
    const { id_alcaldia, codigo_postal, colonia, calle } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE ubicacion SET id_alcaldia = ?, codigo_postal = ?, colonia = ?, calle = ? WHERE id_ubicacion = ?',
            [id_alcaldia, codigo_postal, colonia || null, calle || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }
        res.json({ message: 'Ubicación actualizada correctamente' });
    } catch (err) {
        console.error('actualizarUbicacion:', err);
        res.status(500).json({ error: 'Error al actualizar ubicación' });
    }
};

// DELETE /api/ubicaciones/:id  → hard delete
// Precaución: ubicacion es referenciada por usuario y reporte_alerta
const eliminarUbicacion = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM ubicacion WHERE id_ubicacion = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }
        res.json({ message: 'Ubicación eliminada correctamente' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                error: 'No se puede eliminar: la ubicación está en uso por un usuario o alerta'
            });
        }
        console.error('eliminarUbicacion:', err);
        res.status(500).json({ error: 'Error al eliminar ubicación' });
    }
};

module.exports = { obtenerUbicaciones, crearUbicacion, actualizarUbicacion, eliminarUbicacion };
