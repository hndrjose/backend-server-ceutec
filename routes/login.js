var express = require('express');
var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


// previamente se hace una instlasaion de la libreria de google
//npm install google-auth-library --save   "https://developers.google.com/identity/sign-in/web/backend-auth"
// para verificar la integridad del token
//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);


//==============================================
// AUTENTIFICACION DE GOOGLE

async function verify(token) {
    var ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    var payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.img,
        google: true
            //aqui me muestra toda la informacion del user de google
            // ------payload
    }
}


app.post('/google', async(req, res) => {

    var token = req.body.idtoken;

    var googleUsre = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no Valido'
            });

        });

    Usuario.findOne({ email: googleUsre.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err

            });

        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de Usar su autentificacion Normal',

                });

            } else {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // esto es 4 horas
                res.status(200).json({
                    ok: true,
                    Usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });

            }
        } else {

            // El usuario no exite .. hay que crear nuevo usuario
            var usuario = new Usuario();

            usuario.nombre = googleUsre.nombre;
            usuario.email = googleUsre.email;
            usuario.img = googleUsre.img;
            usuario.google = true;
            usuario.password = ';)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al Crear Usuario',
                        errors: err

                    });

                }


                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // esto es 4 horas

                res.status(200).json({
                    ok: true,
                    Usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        }
    });

    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'OK',
    //     googleUsre: googleUsre
    // });

});



//=================================================
//AUTENTIFICACION NORMAL
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