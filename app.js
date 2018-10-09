// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variable
var app = express();


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})


// Rutas
app.get('/', (req, res, next) => {
    res.status(300).json({
        ok: true,
        mensaje: 'Peticion Realizada Corretamente'
    });
});


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})