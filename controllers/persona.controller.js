const db     = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/personas
// Nunca devolvemos contrasena_hash
const obtenerPersonas = async (req, res) => {
    try {
        // Se agregó foto_url a la consulta
        const [rows] = await db.query(
            'SELECT id_persona, nombre_completo, correo, foto_url, activo, created_at, updated_at FROM persona'
        );
        res.json(rows);
    } catch (err) {
        console.error('obtenerPersonas:', err);
        res.status(500).json({ mensaje: 'Error al obtener personas' });
    }
};

// POST /api/personas
// Body: { nombre_completo, correo, contrasena }
const crearPersona = async (req, res) => {
    const { nombre_completo, correo, contrasena } = req.body;

    if (!nombre_completo || !correo || !contrasena) {
        return res.status(400).json({
            mensaje: 'Campos requeridos: nombre_completo, correo, contrasena'
        });
    }
    try {
        const contrasena_hash = await bcrypt.hash(contrasena, 10);
        const [result] = await db.query(
            'INSERT INTO persona (nombre_completo, correo, contrasena_hash) VALUES (?, ?, ?)',
            [nombre_completo, correo, contrasena_hash]
        );
        res.status(201).json({
            mensaje:    'Persona creada exitosamente',
            id_persona: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensaje: 'El correo ya está registrado' });
        }
        console.error('crearPersona:', err);
        res.status(500).json({ mensaje: 'Error al crear persona' });
    }
};

// PUT /api/personas/:id
// Body: { nombre_completo, contrasena_actual, contrasena_nueva }
// PUT /api/personas/:id
// PUT /api/personas/:id
const actualizarPersona = async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, contrasena_actual, contrasena_nueva } = req.body;

    if (!nombre_completo) {
        return res.status(400).json({ mensaje: 'El nombre completo es requerido' });
    }

    try {
        if (contrasena_actual && contrasena_nueva) {
            const [rows] = await db.query('SELECT contrasena_hash FROM persona WHERE id_persona = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ mensaje: 'Persona no encontrada' });
            }

            const coinciden = await bcrypt.compare(contrasena_actual, rows[0].contrasena_hash);
            if (!coinciden) {
                return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
            }

            const nuevaHash = await bcrypt.hash(contrasena_nueva, 10);
            await db.query(
                'UPDATE persona SET nombre_completo = ?, contrasena_hash = ? WHERE id_persona = ?',
                [nombre_completo, nuevaHash, id]
            );
        } else {
            // CORRECCIÓN: Quitamos el bloque que obligaba a que affectedRows fuera > 0
            await db.query(
                'UPDATE persona SET nombre_completo = ? WHERE id_persona = ?',
                [nombre_completo, id]
            );
        }

        res.json({ mensaje: 'Persona actualizada correctamente' });
    } catch (err) {
        console.error('actualizarPersona:', err);
        res.status(500).json({ mensaje: 'Error al actualizar persona' });
    }
};
// PUT /api/personas/:id/foto
// Nota: En la ruta debes usar un middleware como multer para procesar la imagen
const actualizarFoto = async (req, res) => {
    const { id } = req.params;
    
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se recibió ninguna imagen' });
    }

    try {
        // Ajusta la ruta dependiendo de cómo sirvas tus archivos estáticos
        const foto_url = `/uploads/${req.file.filename}`;

        const [result] = await db.query(
            'UPDATE persona SET foto_url = ? WHERE id_persona = ?',
            [foto_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }

        res.json({ 
            mensaje: 'Foto de perfil actualizada exitosamente', 
            foto_url: foto_url 
        });
    } catch (err) {
        console.error('actualizarFoto:', err);
        res.status(500).json({ mensaje: 'Error al procesar la foto en la base de datos' });
    }
};

// DELETE /api/personas/:id  → soft delete (activo = 0)
const eliminarPersona = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE persona SET activo = 0 WHERE id_persona = ?', [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }
        res.json({ mensaje: 'Persona desactivada correctamente' });
    } catch (err) {
        console.error('eliminarPersona:', err);
        res.status(500).json({ mensaje: 'Error al desactivar persona' });
    }
};

module.exports = { 
    obtenerPersonas, 
    crearPersona, 
    actualizarPersona, 
    actualizarFoto, // Se exporta la nueva función
    eliminarPersona 
};