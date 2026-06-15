// middlewares/validador.js
const { body, validationResult, oneOf } = require('express-validator');

// ─── ANTI SQL INJECTION ───────────────────────────────────────────────────────
// Recorre recursivamente req.body para detectar patrones sospechosos.
// Esto NO sustituye validación de negocio ni consultas parametrizadas.
const antiSQLInjection = (req, res, next) => {
    const peligroso = /\b(DROP|DELETE|UPDATE|SELECT|INSERT|ALTER|CREATE|TRUNCATE|EXEC|UNION|CAST|CONVERT|CHAR|NCHAR|VARCHAR)\b/i;
    const comentarios = /--|\/\*|\*\/|;--|xp_/i;

    function revisarValor(valor, campo) {
        if (typeof valor !== 'string') return null;

        // Saltar imágenes base64 y textos muy largos (foto, etc.)
        if (valor.startsWith('data:image/') || valor.length > 5000) return null;

        if (peligroso.test(valor) || comentarios.test(valor)) {
            return `Campo '${campo}': contiene caracteres o comandos no permitidos.`;
        }
        return null;
    }

    function recorrer(obj, prefijo = '') {
        const errores = [];

        if (!obj || typeof obj !== 'object') return errores;

        for (const [campo, valor] of Object.entries(obj)) {
            const nombreCampo = prefijo ? `${prefijo}.${campo}` : campo;

            if (Array.isArray(valor)) {
                for (let i = 0; i < valor.length; i++) {
                    const v = valor[i];
                    const subCampo = `${nombreCampo}[${i}]`;
                    if (typeof v === 'object' && v !== null) {
                        errores.push(...recorrer(v, subCampo));
                    } else {
                        const error = revisarValor(v, subCampo);
                        if (error) errores.push(error);
                    }
                }
            } else if (typeof valor === 'object' && valor !== null) {
                errores.push(...recorrer(valor, nombreCampo));
            } else {
                const error = revisarValor(valor, nombreCampo);
                if (error) errores.push(error);
            }
        }

        return errores;
    }

    const errores = recorrer(req.body || {});

    if (errores.length > 0) {
        return res.status(400).json({
            success: false,
            mensaje: 'Detectado intento de actividad sospechosa.',
            errores: errores.map(msg => ({ msg }))
        });
    }

    next();
};

// ─── AUXILIARES ───────────────────────────────────────────────────────────────
const fechaNoFutura = (value) => {
    const fecha = new Date(`${value}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (Number.isNaN(fecha.getTime())) {
        throw new Error('La fecha no tiene un formato válido');
    }

    if (fecha > hoy) {
        throw new Error('La fecha no puede ser futura');
    }

    return true;
};

const fechaPosteriorOIgual = (value, ref) => {
    const fecha = new Date(`${value}T00:00:00`);
    const referencia = new Date(`${ref}T00:00:00`);

    if (Number.isNaN(fecha.getTime())) {
        throw new Error('La fecha no tiene un formato válido');
    }

    if (fecha < referencia) {
        throw new Error('La fecha no puede ser anterior a la fecha de referencia');
    }

    return true;
};

const esTextoOpcional = (max) =>
    body().custom((_, { req, path }) => {
        const value = req.body[path];
        if (value === undefined || value === null || value === '') return true;
        if (typeof value !== 'string') {
            throw new Error('Debe ser texto');
        }
        if (value.trim().length > max) {
            throw new Error(`No puede exceder ${max} caracteres`);
        }
        return true;
    });

// ─── DICCIONARIO DE REGLAS POR RUTA ──────────────────────────────────────────
const reglasValidacion = {

    '/auth/login': [
        body('correo')
            .exists({ checkFalsy: true }).withMessage('El correo es obligatorio')
            .trim()
            .isEmail().withMessage('Debe ser un correo electrónico válido')
            .normalizeEmail(),
        body('contrasena')
            .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria')
            .isString().withMessage('La contraseña debe ser texto')
            .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
    ],

    '/auth/register': [
        body('nombre_completo')
            .exists({ checkFalsy: true }).withMessage('El nombre completo es obligatorio')
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
        body('correo')
            .exists({ checkFalsy: true }).withMessage('El correo es obligatorio')
            .trim()
            .isEmail().withMessage('Debe ser un correo electrónico válido')
            .normalizeEmail(),
        body('contrasena')
            .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria')
            .isString().withMessage('La contraseña debe ser texto')
            .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('id_tipo_usuario')
            .exists({ checkFalsy: true }).withMessage('El tipo de usuario es obligatorio')
            .isInt({ min: 1 }).withMessage('El tipo de usuario debe ser un número válido')
    ],

    '/personas': [
        body('nombre')
            .exists({ checkFalsy: true }).withMessage('El nombre es obligatorio')
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        body('apellidos')
            .exists({ checkFalsy: true }).withMessage('Los apellidos son obligatorios')
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
        body('correo')
            .optional({ nullable: true, checkFalsy: true })
            .trim()
            .isEmail().withMessage('El correo no tiene un formato válido')
            .normalizeEmail(),
        body('telefono')
            .optional({ nullable: true, checkFalsy: true })
            .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres')
            .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono contiene caracteres no permitidos')
    ],

    '/mascotas/registrar': [
        oneOf([
            body('nombre')
                .exists({ checkFalsy: true })
                .trim()
                .isLength({ min: 1, max: 50 }).withMessage('El nombre no puede exceder 50 caracteres'),
            body('nombre_perro')
                .exists({ checkFalsy: true })
                .trim()
                .isLength({ min: 1, max: 50 }).withMessage('El nombre no puede exceder 50 caracteres')
        ], 'Debes enviar nombre o nombre_perro'),

        body('peso')
            .optional({ nullable: true, checkFalsy: true })
            .isFloat({ min: 0.1, max: 200 }).withMessage('El peso debe ser un número válido entre 0.1 y 200 kg'),

        body('edad')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 0, max: 40 }).withMessage('La edad debe ser un número válido entre 0 y 40'),

        body('fecha_nacimiento')
            .optional({ nullable: true, checkFalsy: true })
            .isISO8601({ strict: true, strictSeparator: true })
            .withMessage('La fecha de nacimiento no tiene un formato válido')
            .custom(fechaNoFutura),

        body('sexo')
            .optional({ nullable: true, checkFalsy: true })
            .isIn(['Macho', 'Hembra', 'Desconocido']).withMessage('Sexo inválido'),

        body('color')
            .optional({ nullable: true, checkFalsy: true })
            .trim()
            .isLength({ max: 50 }).withMessage('El color no puede exceder 50 caracteres'),

        body('senas_particulares')
            .optional({ nullable: true, checkFalsy: true })
            .trim()
            .isLength({ max: 255 }).withMessage('Las señas particulares no pueden exceder 255 caracteres'),

        body('id_usuario')
            .exists({ checkFalsy: true }).withMessage('El id_usuario es obligatorio')
            .isInt({ min: 1 }).withMessage('El id_usuario debe ser un número válido'),

        body('id_raza')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('La raza debe ser un id válido'),

        body('id_pelaje')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('El pelaje debe ser un id válido'),

        body('id_tamano')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('El tamaño debe ser un id válido'),

        body('id_ojos')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('Los ojos deben ser un id válido'),

        body('id_tipo_pelaje')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('El tipo de pelaje debe ser un id válido'),

        body('ruac')
            .optional({ nullable: true, checkFalsy: true })
            .trim()
            .isLength({ max: 100 }).withMessage('El RUAC no puede exceder 100 caracteres')
            .matches(/^[A-Za-z0-9\-_.\/]+$/).withMessage('El RUAC contiene caracteres no permitidos')
    ],

    '/reportes-alerta': [
        body('comentarios')
            .optional({ nullable: true, checkFalsy: true })
            .trim()
            .isLength({ min: 10, max: 1000 }).withMessage('Los comentarios deben tener entre 10 y 1000 caracteres'),

        body('id_mascota')
            .exists({ checkFalsy: true }).withMessage('Debes seleccionar una mascota')
            .isInt({ min: 1 }).withMessage('El id_mascota debe ser un número válido'),

        body('id_ubicacion_extravio')
            .exists({ checkFalsy: true }).withMessage('Debes seleccionar una ubicación')
            .isInt({ min: 1 }).withMessage('El id_ubicacion_extravio debe ser un número válido'),

        body('fecha_expedicion')
            .exists({ checkFalsy: true }).withMessage('La fecha de expedición es obligatoria')
            .isISO8601({ strict: true, strictSeparator: true })
            .withMessage('La fecha de expedición no tiene un formato válido')
            .custom(fechaNoFutura),

        body('fecha_caducidad')
            .optional({ nullable: true, checkFalsy: true })
            .isISO8601({ strict: true, strictSeparator: true })
            .withMessage('La fecha de caducidad no tiene un formato válido')
            .custom((value, { req }) => fechaPosteriorOIgual(value, req.body.fecha_expedicion))
    ],

    '/reportes-tecnicos': [
        body('descripcion')
            .exists({ checkFalsy: true }).withMessage('La descripción es obligatoria')
            .trim()
            .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres')
    ]
};

// ─── VERIFICAR ERRORES DE express-validator ───────────────────────────────────
const verificarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            mensaje: 'Error de validación en los datos enviados.',
            errores: errores.array()
        });
    }
    next();
};

// ─── MIDDLEWARE PRINCIPAL ─────────────────────────────────────────────────────
const validarRuta = async (req, res, next) => {
    // Saltar GETs y rutas no registradas
    if (req.method === 'GET') return next();

    // 1. Anti SQL Injection primero (antes de cualquier validación de campos)
    await new Promise((resolve) => antiSQLInjection(req, res, resolve));

    if (res.headersSent) return;

    // 2. Validaciones de campos específicos por ruta
    const reglas = reglasValidacion[req.path];
    if (!reglas) return next();

    await Promise.all(reglas.map(regla => regla.run(req)));

    return verificarErrores(req, res, next);
};

module.exports = validarRuta;