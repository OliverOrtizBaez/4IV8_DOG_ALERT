const db = require('../config/db');

// GET /api/reportes-alerta
// Devuelve alertas activas con datos de la mascota, dueño, ubicación y foto
const obtenerReportes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ra.id_reporte_alerta,
                m.id_mascota,
                m.nombre         AS mascota,
                m.ruac,
                m.foto,
                m.sexo,
                m.peso,
                r.nombre         AS raza,
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
            JOIN mascota m        ON ra.id_mascota              = m.id_mascota
            JOIN usuario u        ON m.id_usuario               = u.id_usuario
            JOIN persona pers     ON u.id_persona               = pers.id_persona
            JOIN ubicacion ub     ON ra.id_ubicacion_extravio   = ub.id_ubicacion
            JOIN alcaldia al      ON ub.id_alcaldia             = al.id_alcaldia
            LEFT JOIN catalogo_raza r ON m.id_raza              = r.id_raza
            WHERE ra.activo = 1
            ORDER BY ra.fecha_expedicion DESC
        `);

        res.set('Cache-Control', 'no-store');
        res.json(rows);
    } catch (err) {
        console.error('obtenerReportes:', err);
        res.status(500).json({ error: 'Error al obtener reportes de alerta' });
    }
};

// POST /api/reportes-alerta
// Body: { id_mascota, recompensa?, comentarios?, fecha_expedicion,
//         fecha_caducidad?, calle, colonia, alcaldia, codigo_postal }
// Primero inserta la ubicación y luego el reporte en una transacción
const crearReporte = async (req, res) => {
    const {
        id_mascota,
        recompensa,
        comentarios,
        fecha_expedicion,
        fecha_caducidad,
        // Datos de ubicación que manda el frontend (reporte.js)
        calle,
        colonia,
        alcaldia,      // nombre de la alcaldía
        codigo_postal
    } = req.body;

    if (!id_mascota || !fecha_expedicion) {
        return res.status(400).json({
            error: 'Campos requeridos: id_mascota, fecha_expedicion'
        });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Buscar o crear la alcaldía
        let id_alcaldia = null;
        if (alcaldia) {
            const [alcaldiaRows] = await conn.query(
                'SELECT id_alcaldia FROM alcaldia WHERE nombre = ? LIMIT 1',
                [alcaldia]
            );
            if (alcaldiaRows.length > 0) {
                id_alcaldia = alcaldiaRows[0].id_alcaldia;
            } else {
                const [alcaldiaResult] = await conn.query(
                    'INSERT INTO alcaldia (nombre) VALUES (?)',
                    [alcaldia]
                );
                id_alcaldia = alcaldiaResult.insertId;
            }
        }

        // 2. Insertar la ubicación
        const [ubicacionResult] = await conn.query(`
            INSERT INTO ubicacion (id_alcaldia, codigo_postal, colonia, calle)
            VALUES (?, ?, ?, ?)
        `, [
            id_alcaldia   || null,
            codigo_postal || '00000',
            colonia       || null,
            calle         || null
        ]);
        const id_ubicacion = ubicacionResult.insertId;

        // 3. Insertar el reporte de alerta
        const [reporteResult] = await conn.query(`
            INSERT INTO reporte_alerta
                (id_mascota, id_ubicacion_extravio, recompensa, comentarios,
                 fecha_expedicion, fecha_caducidad)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            id_mascota,
            id_ubicacion,
            recompensa       || 0.00,
            comentarios      || null,
            fecha_expedicion,
            fecha_caducidad  || null
        ]);

        await conn.commit();

        res.status(201).json({
            message:           'Reporte de alerta creado exitosamente',
            id_reporte_alerta: reporteResult.insertId,
            id_ubicacion
        });

    } catch (err) {
        await conn.rollback();
        console.error('crearReporte:', err);
        res.status(500).json({ error: 'Error al crear el reporte de alerta' });
    } finally {
        conn.release();
    }
};

// PUT /api/reportes-alerta/:id
const actualizarReporte = async (req, res) => {
    const { id } = req.params;
    const { esta_validado, recompensa, comentarios, fecha_caducidad, activo } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE reporte_alerta SET
                esta_validado   = ?,
                recompensa      = ?,
                comentarios     = ?,
                fecha_caducidad = ?,
                activo          = ?
            WHERE id_reporte_alerta = ?
        `, [
            esta_validado ? 1 : 0,
            recompensa      || 0,
            comentarios     || null,
            fecha_caducidad || null,
            activo !== undefined ? (activo ? 1 : 0) : 1,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }
        res.json({ message: 'Reporte actualizado correctamente' });
    } catch (err) {
        console.error('actualizarReporte:', err);
        res.status(500).json({ error: 'Error al actualizar el reporte' });
    }
};

// DELETE /api/reportes-alerta/:id  → soft delete
const eliminarReporte = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE reporte_alerta SET activo = 0 WHERE id_reporte_alerta = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }
        res.json({ message: 'Reporte desactivado correctamente' });
    } catch (err) {
        console.error('eliminarReporte:', err);
        res.status(500).json({ error: 'Error al desactivar el reporte' });
    }
};

module.exports = { obtenerReportes, crearReporte, actualizarReporte, eliminarReporte };