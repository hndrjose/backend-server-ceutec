var express = require('express');
var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err

            });

        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err

            });



        }

        if (!bycrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err

            });

        }

        // crear token
        // instalamos npm install jsonwebtoken 
        usuarioDB.password = ';)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // esto es 4 horas
        // se puede ir a la pagina jwt.io ahi hay informacion de como esta estruturado un token y se puede mostrar los token


        res.status(200).json({
            ok: true,
            Usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });


    });


});

module.exports = app;