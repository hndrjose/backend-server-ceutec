// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar Variable
var app = express();

// Body Parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//server index config
//sirve para mostrar las imagenes de todas las carpetas dendro del directorio ouploads
//localhost:3000/uploads
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));



//Inicializar Rutas
var appRutas = require('./routes/app');
var usuarioRutas = require('./routes/usuario');
var hospitalRutas = require('./routes/hospital');
var medicoRutas = require('./routes/medico');
var busquedaRutas = require('./routes/busqueda');
var uploadRutas = require('./routes/upload');
var imagenesRutas = require('./routes/imagenes')
var loginRutas = require('./routes/login');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})


// Rutas
app.use('/usuario', usuarioRutas);
app.use('/hospital', hospitalRutas);
app.use('/medico', medicoRutas);
app.use('/login', loginRutas);
app.use('/busqueda', busquedaRutas);
app.use('/upload', uploadRutas);
app.use('/imagenes', imagenesRutas);
app.use('/', appRutas);



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})