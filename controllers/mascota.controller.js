const db = require('../config/db');

// GET /api/mascotas
// Devuelve mascotas con todos sus catálogos resueltos y el nombre del dueño
const obtenerMascotas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                m.id_mascota,
                m.nombre,
                m.ruac,
                m.fecha_nacimiento,
                m.peso,
                m.tiene_collar,
                m.activo,
                m.created_at,
                r.nombre        AS raza,
                p.color         AS color_pelaje,
                tp.tipo         AS tipo_pelaje,
                t.descripcion   AS tamano,
                o.color         AS color_ojos,
                pers.nombre_completo AS dueno,
                u.id_usuario
            FROM mascota m
            JOIN usuario u      ON m.id_usuario     = u.id_usuario
            JOIN persona pers   ON u.id_persona      = pers.id_persona
            LEFT JOIN catalogo_raza r           ON m.id_raza        = r.id_raza
            LEFT JOIN catalogo_pelaje p         ON m.id_pelaje      = p.id_pelaje
            LEFT JOIN catalogo_tipo_pelaje tp   ON m.id_tipo_pelaje = tp.id_tipo_pelaje
            LEFT JOIN catalogo_tamano t         ON m.id_tamano      = t.id_tamano
            LEFT JOIN catalogo_ojos o           ON m.id_ojos        = o.id_ojos
            WHERE m.activo = 1
            ORDER BY m.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('obtenerMascotas:', err);
        res.status(500).json({ error: 'Error al obtener mascotas' });
    }
};

// GET /api/mascotas/usuario/:id_usuario  → mascotas de un dueño específico
// (útil para la pantalla "Mis Mascotas" del dueño)
const obtenerMascotasPorUsuario = async (req, res) => {
    const id_usuario = req.params.id; 
    try {
        const [rows] = await db.query(`
            SELECT
                m.id_mascota,
                m.nombre,
                m.ruac,
                m.fecha_nacimiento,
                m.peso,
                m.tiene_collar,
                m.sexo,
                m.senas_particulares,
                m.foto,
                DATE_FORMAT(m.created_at, '%d/%m/%Y') AS fechaRegistro,
                TIMESTAMPDIFF(YEAR, m.fecha_nacimiento, CURDATE()) AS edad,
                r.nombre      AS raza,
                p.color       AS color_pelaje,
                tp.tipo       AS tipo_pelaje,
                t.descripcion AS tamano,
                o.color       AS color_ojos
            FROM mascota m
            LEFT JOIN catalogo_raza r           ON m.id_raza        = r.id_raza
            LEFT JOIN catalogo_pelaje p         ON m.id_pelaje      = p.id_pelaje
            LEFT JOIN catalogo_tipo_pelaje tp   ON m.id_tipo_pelaje = tp.id_tipo_pelaje
            LEFT JOIN catalogo_tamano t         ON m.id_tamano      = t.id_tamano
            LEFT JOIN catalogo_ojos o           ON m.id_ojos        = o.id_ojos
            WHERE m.id_usuario = ? AND m.activo = 1
        `, [id_usuario]);
        res.set('Cache-Control', 'no-store');
        res.json(rows);
    } catch (err) {
        console.error('obtenerMascotasPorUsuario:', err);
        res.status(500).json({ error: 'Error al obtener mascotas del usuario' });
    }
};

// POST /api/mascotas
// Body: { id_usuario, nombre, fecha_nacimiento?, id_raza?, id_pelaje?,
//         id_tamano?, id_ojos?, id_tipo_pelaje?, peso?, tiene_collar?, ruac? }
const crearMascota = async (req, res) => {
    const {
        id_usuario, nombre,
        fecha_nacimiento, id_raza, id_pelaje, id_tamano,
        id_ojos, id_tipo_pelaje, peso,
        collar,          // ← antes era "tiene_collar", el frontend manda "collar"
        ruac,
        sexo,            // ← campo nuevo que faltaba leer
        senas_particulares, // ← campo nuevo que faltaba leer
        foto             // ← foto en base64 que faltaba leer
    } = req.body;

    if (!id_usuario || !nombre) {
        return res.status(400).json({
            error: 'Campos requeridos: id_usuario, nombre'
        });
    }
    try {
        const [result] = await db.query(`
            INSERT INTO mascota
                (id_usuario, nombre, fecha_nacimiento, id_raza, id_pelaje,
                 id_tamano, id_ojos, id_tipo_pelaje, peso, tiene_collar, ruac,
                 sexo, senas_particulares, foto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_usuario, nombre,
            fecha_nacimiento    || null,
            id_raza             || null,
            id_pelaje           || null,
            id_tamano           || null,
            id_ojos             || null,
            id_tipo_pelaje      || null,
            peso                || null,
            collar ? 1 : 0,     // ← ahora lee "collar" correctamente
            ruac                || null,
            sexo                || null,
            senas_particulares  || null,
            foto                || null
        ]);
        res.status(201).json({
            message:    'Mascota registrada exitosamente',
            id_mascota: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El RUAC ya está registrado' });
        }
        console.error('❌ crearMascota:', err);
        res.status(500).json({ error: 'Error al registrar mascota' });
    }
};

// PUT /api/mascotas/:id
const actualizarMascota = async (req, res) => {
    const { id } = req.params;
    const {
        nombre, fecha_nacimiento, id_raza, id_pelaje, id_tamano,
        id_ojos, id_tipo_pelaje, peso, tiene_collar, ruac
    } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE mascota SET
                nombre          = ?,
                fecha_nacimiento= ?,
                id_raza         = ?,
                id_pelaje       = ?,
                id_tamano       = ?,
                id_ojos         = ?,
                id_tipo_pelaje  = ?,
                peso            = ?,
                tiene_collar    = ?,
                ruac            = ?
            WHERE id_mascota = ?
        `, [
            nombre,
            fecha_nacimiento  || null,
            id_raza           || null,
            id_pelaje         || null,
            id_tamano         || null,
            id_ojos           || null,
            id_tipo_pelaje    || null,
            peso              || null,
            tiene_collar ? 1 : 0,
            ruac              || null,
            id
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        res.json({ message: 'Mascota actualizada correctamente' });
    } catch (err) {
        console.error('actualizarMascota:', err);
        res.status(500).json({ error: 'Error al actualizar mascota' });
    }
};

// DELETE /api/mascotas/:id  → soft delete
const eliminarMascota = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE mascota SET activo = 0 WHERE id_mascota = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        res.json({ message: 'Mascota desactivada correctamente' });
    } catch (err) {
        console.error('eliminarMascota:', err);
        res.status(500).json({ error: 'Error al desactivar mascota' });
    }
};

module.exports = {
    obtenerMascotas,
    obtenerMascotasPorUsuario,
    crearMascota,
    actualizarMascota,
    eliminarMascota
};
