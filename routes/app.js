var express = require('express');
var app = express();

// Rutas
app.get('/', (req, res, next) => {
    res.status(300).json({
        ok: true,
        mensaje: 'Peticion Realizada Corretamente'
    });
});

module.exports = app;