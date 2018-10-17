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

//Inicializar Rutas
var appRutas = require('./routes/app');
var usuarioRutas = require('./routes/usuario');
var loginRutas = require('./routes/login');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})


// Rutas
app.use('/usuario', usuarioRutas);
app.use('/login', loginRutas);
app.use('/', appRutas);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})