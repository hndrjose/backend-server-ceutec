var express = require('express');
var bycrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

//var SEED = require('../config/config').SEED;
var mdauntentic = require('../midlewares/autenticacion');

var app = express();
var Usuario = require('../models/usuario');




//========================================================================
// OBTENER USUARIOS
//========================================================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Cargando Usuario',
                        errors: err

                    });

                }
                res.status(300).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});
// ====================================================================
// FIN OBTENER USUARIOS
// ====================================================================






//========================================================================
// CREAR NUEVO USUARIO
// libreria de ayuda: buscar en google 'body parser node'
// npm install body-parser
// libreria var bodyParser = require('body-parser')
//========================================================================
app.post('/', mdauntentic.verificatoken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bycrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioguardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Cargando Usuario',
                errors: err

            });

        }

        res.status(201).json({
            ok: true,
            usuario: usuarioguardado,
            usuariotoken: req.usuario
        });
    });
});
// ====================================================================
// FIN CREAR NUEVOS USUARIOS
// ====================================================================



//========================================================================
// ACTUALIZAR USUARIOS
//========================================================================
app.put('/:id', mdauntentic.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err

            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Usuario ' + id + ' no existe',
                errors: { message: 'no existe el usuario' }

            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioguardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Usuario',
                    errors: err

                });
            }

            usuarioguardado.password = ';)';
            res.status(200).json({
                ok: true,
                usuario: usuarioguardado
            });

        });

    });

});
//========================================================================
// FIN DE ACTUALIZAR USUARIOS
//========================================================================

//========================================================================
// INICIO DE ELIMIAR USUARIOS POT ID
//========================================================================
app.delete('/:id', mdauntentic.verificatoken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Borrar Usuario',
                errors: err

            });
        }

        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe el Usuario con ese Id',
                errors: { message: 'El Usuario no fue Encontrado' }

            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});
//========================================================================
// FIN DE ELIMINAR USUARIOS
//========================================================================
module.exports = app;