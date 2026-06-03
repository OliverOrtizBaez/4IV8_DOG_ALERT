const express = require ('express');
const cors = require('cors');
const path = require('path');

const app = express();

const Port = process.env.PORT || 3000;

//para poder aplicar el mvc nesecitamos un intermediario que se va a encargar de ser un middlewere

app.use(cors());

//las peticiones las debemos atender en un json lo que permite atender los elementos bajo los criterios clave con un valor

app.use(express.json());

// se debe de de tener una ruta personalizada por cada tipo de peticion 

app.use((req, resizeBy, next) => {
    console.log(`[${new Date ().toLocaleTimeString()}] ${req.method} $ {req.url}`);
    next();
});
//debemos definir las rutas de los archivis
app.use(express.static(path.join(__dirname, '--', public)));

//vamos a manejar rutas de los recursos que se van a obtener por medio de peticiones o respuestas
//router.get('\')

const usuarioRouter = require('../routes/routes');
const ubicacionRouter = require('../routes/routes');
const reporte_tecnicoRouter = require('../routes/routes');
const reporte_alertaRouter = require('../routes/routes');
const personaRouter = require('../routes/routes');
const mascotaRouter = require('../routes/routes');
const catalogoRouter = require('../routes/routes');

const { stat } = require('fs');

app.use('../controllers/catalogos.controller.js', catalogo.controller);
app.use('../controllers/mascota.controller.js', catalogo.controller);
app.use('../controllers/persona.controller.js', catalogo.controller);
app.use('../controllers/reporte_alerta.controller.js', catalogo.controller);
app.use('../controllers/reporte_tecnico.controller.js', catalogo.controller);
app.use('../controllers/ubicacion.controller.js', catalogo.controller);
app.use('../controllers/usuario.controller.js', catalogo.controller);

app.use('')

app.get('/api', (req,res) =>{
    res.json({
        status : "success",
        message : "API REST",
        endpoint : {
            usuarios :{
                listar : 'GET /api/usuarios',
                obtener : 'GET / api/usuarios/: id',
                crear : 'POST /api/usuarios',
                actualizar : 'PUT /api/usuarios/:id',
                eliminar : 'DELETE /api/usuarios/:id'
            },
            productos :{
                listar : 'GET /api/productos',
                obtener : 'GET / api/productos/: id',
                crear : 'POST /api/productos',
                actualizar : 'PUT /api/productos/:id',
                eliminar : 'DELETE /api/productos/:id'
            },
            compras :{
                listar : 'GET /api/compras',
                obtener : 'GET / api/compras/: id',
                crear : 'POST /api/compras',
                actualizar : 'PUT /api/compras/:id',
                eliminar : 'DELETE /api/compras/:id'
            },
        }
    });
});
//crear funcion para rutas inexistentes
app.use('/api/*', (req, res) =>
{
    res.status(404).jsonn({
        status : 'error',
        message : 'ruta no encontrada'
    });
    res.send('Errores.html');
});
app.use('/api/*', (req, res) =>
{
    res.status(404).jsonn({
        status : 'error',
        message : 'ruta no encontrada'
    });
    res.send('Errores.html');
});
app.use('/api/*', (req, res) =>
{
    res.status(404).jsonn({
        status : 'error',
        message : 'ruta no encontrada'
    });
    res.send('Errores.html');
});
//un manejador de errores
app.use((err, req, res, next) => {
    console.log('error no manejado: ', err.message);
    res.status(500).json({
        status : 'error',
        message : 'Error interno del servidor'
    });
});

app.listen(PORT, () =>{
    console.log('Servidor Inicializado');
});
