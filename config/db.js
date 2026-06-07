// Importamos la versión normal de mysql2
const mysql = require('mysql2');

// Creamos el Pool
const pool = mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'F20CBfEjt',
    database: process.env.DB_NAME || 'alerta_canina',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '-06:00'
});

// Verificamos la conexión
pool.getConnection((err, conn) => {
    if (err) {
        console.error(' No se pudo conectar a MySQL:', err.message);
        process.exit(1); 
    } else {
        console.log(' Conectado a MySQL — base de datos: alerta_canina');
        conn.release();
    }
});

// EXPORTAMOS EL POOL COMO PROMESA (.promise() hace que db.query funcione con await)
module.exports = pool.promise();