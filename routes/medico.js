var express = require('express');

var app = express();
var Medico = require('../models/medico');
var mdauntentic = require('../midlewares/autenticacion');

//========================================================================
// OBTENER MEDICOS
//========================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre usuario hospital')
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medico) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Cargando Medicos',
                        errors: err

                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(300).json({
                        ok: true,
                        medico: medico,
                        total: conteo

                    });
                });

            });
});
// ====================================================================
// FIN OBTENER MEDICOS
// ====================================================================

// ====================================================================
// CREAR MEDICOS
// ====================================================================
app.post('/', mdauntentic.verificatoken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoguardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Crear Medicos',
                errors: err
            });
        }

        res.status(300).json({
            ok: true,
            medico: medicoguardado
        });
    });

});

//========================================================================
// ACTUALIZAR 
//========================================================================
app.put('/:id', mdauntentic.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital',
                errors: err

            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico ' + id + ' no existe',
                errors: { message: 'no existe el medico' }

            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoguardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Medico',
                    errors: err

                });


            }

            res.status(200).json({
                ok: true,
                medico: medicoguardado
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

    Medico.findByIdAndRemove(id, (err, borrarmedico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Borrar Medico',
                errors: err

            });
        }

        if (!borrarmedico) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe el Medico con ese Id',
                errors: { message: 'El Medico no fue Encontrado' }

            });
        }
        res.status(200).json({
            ok: true,
            medico: borrarmedico
        });

    });
});
//========================================================================
// FIN DE ELIMINAR USUARIOS
//========================================================================
module.exports = app;