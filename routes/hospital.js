var express = require('express');


var app = express();
var hospitals = require('../models/hospital');
var mdauntentic = require('../midlewares/autenticacion');



//========================================================================
// OBTENER USUARIOS
//========================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    hospitals.find({}, 'nombre  img usuario')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, hospital) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Cargando Hospital',
                        errors: err

                    });
                }


                hospitals.count({}, (err, conteo) => {
                    res.status(300).json({
                        ok: true,
                        hospital: hospital,
                        total: conteo
                    });
                });


            });

});
// ====================================================================
// FIN OBTENER USUARIOS
// ====================================================================

// ====================================================================
// CREAR HOSPITALES
// ====================================================================
app.post('/', mdauntentic.verificatoken, (req, res) => {

    var body = req.body;

    var hospital = new hospitals({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Cargando Hospital',
                errors: err

            });
        }
        res.status(300).json({
            ok: true,
            //body: body
            hospital: hospitalGuardado
        });

    });
});
//========================================================================
// ACTUALIZAR 
//========================================================================
app.put('/:id', mdauntentic.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    hospitals.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital',
                errors: err

            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital ' + id + ' no existe',
                errors: { message: 'no existe el hospital' }

            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalguardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Hospital',
                    errors: err

                });


            }

            res.status(200).json({
                ok: true,
                hospital: hospitalguardado
            });

            //         usuarioguardado.password = ';)';

        });
    });
});


//========================================================================
// FIN DE ACTUALIZAR USUARIOS
//========================================================================

//========================================================================
// INICIO DE ELIMIAR HOSPITAL POT ID
//========================================================================
app.delete('/:id', mdauntentic.verificatoken, (req, res) => {

    var id = req.params.id;

    hospitals.findByIdAndRemove(id, (err, guardarhospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Borrar Hospital',
                errors: err

            });
        }

        if (!guardarhospital) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe el Hospital con ese Id',
                errors: { message: 'El Hospital no fue Encontrado' }

            });
        }
        res.status(200).json({
            ok: true,
            hospital: guardarhospital
        });

    });
});
//========================================================================
// FIN DE ELIMINAR USUARIOS
//========================================================================
module.exports = app;