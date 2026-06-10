const db     = require('../config/db');
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { correo, contrasena }
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    try {
        // Traemos persona + usuario + tipo + FOTO en un solo query
        const [rows] = await db.query(`
            SELECT
                p.id_persona,
                p.nombre_completo,
                p.correo,
                p.contrasena_hash,
                p.foto_url,
                u.id_usuario,
                u.id_tipo_usuario,
                tu.tipo AS tipo_usuario
            FROM persona p
            JOIN usuario u ON p.id_persona = u.id_persona
            JOIN catalogo_tipo_usuario tu ON u.id_tipo_usuario = tu.id_tipo_usuario
            WHERE p.correo = ? AND p.activo = 1 AND u.activo = 1
            LIMIT 1
        `, [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const persona = rows[0];
        const passwordValido = await bcrypt.compare(contrasena, persona.contrasena_hash);

        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // NUNCA devuelvas el hash de la contraseña al frontend
        // Enviamos los datos "sueltos" para que coincidan con lo que espera el main.js
        res.json({
            message:          'Login exitoso',
            id_usuario:       persona.id_usuario,
            id_persona:       persona.id_persona,
            nombre_completo:  persona.nombre_completo,
            correo:           persona.correo,
            foto_url:         persona.foto_url,
            tipo_usuario:     persona.tipo_usuario,
            id_tipo_usuario:  persona.id_tipo_usuario
        });

    } catch (err) {
        console.error('login:', err);
        res.status(500).json({ error: 'Error en el proceso de login' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { nombre_completo, correo, contrasena, id_tipo_usuario }
// Crea persona + usuario dentro de una transacción (si uno falla, ambos se revierten)
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
    const { nombre_completo, correo, contrasena, id_tipo_usuario } = req.body;

    if (!nombre_completo || !correo || !contrasena || !id_tipo_usuario) {
        return res.status(400).json({
            error: 'Faltan campos requeridos: nombre_completo, correo, contrasena, id_tipo_usuario'
        });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Hash de la contraseña (10 rondas de salt)
        const contrasena_hash = await bcrypt.hash(contrasena, 10);

        // 1. Insertar en persona
        const [personaResult] = await conn.query(
            'INSERT INTO persona (nombre_completo, correo, contrasena_hash) VALUES (?, ?, ?)',
            [nombre_completo, correo, contrasena_hash]
        );
        const id_persona = personaResult.insertId;

        // 2. Insertar en usuario usando el id_persona recién creado
        const [usuarioResult] = await conn.query(
            'INSERT INTO usuario (id_persona, id_tipo_usuario) VALUES (?, ?)',
            [id_persona, id_tipo_usuario]
        );

        await conn.commit();

        res.status(201).json({
            message:    'Registro exitoso',
            id_persona,
            id_usuario: usuarioResult.insertId
        });

    } catch (err) {
        await conn.rollback();
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
        }
        console.error('register:', err);
        res.status(500).json({ error: 'Error en el proceso de registro' });
    } finally {
        conn.release();
    }
};

module.exports = { login, register };