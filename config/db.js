const mysql = require('mysql2/promise');

// Pool de conexiones (más eficiente que una sola conexión)
const pool = mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'F20CBfEjt',          // ← Pon aquí tu contraseña de MySQL
    database: process.env.DB_NAME || 'alerta_canina',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '-06:00'                            // Zona horaria de CDMX
});

// Verifica la conexión al arrancar el servidor
pool.getConnection()
    .then(conn => {
        console.log(' Conectado a MySQL — base de datos: alerta_canina');
        conn.release();
    })
    .catch(err => {
        console.error(' No se pudo conectar a MySQL:', err.message);
        process.exit(1); // Detiene el servidor si no hay BD
    });

module.exports = pool;
