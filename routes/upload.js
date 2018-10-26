var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

// libreria File System no requiere intalacion adicional
var fs = require('fs');


var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Coleccion Tipos
    var tipovalidos = ['hospitales', 'medicos', 'usuarios'];

    if (tipovalidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Coleccion no es valido',
            errors: { message: "Tipo de Coleccion no es valido" }

        });

    }



    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: "Debe de seleccionar una Imagen" }

        });
    }




    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombrecortado = archivo.name.split('.');
    var extencion = nombrecortado[nombrecortado.length - 1];

    //solo extenciones permitidas
    var extencionesvalidas = ['jpg', 'png', 'gif'];

    if (extencionesvalidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las Extenciones son:' + extencionesvalidas.join(', ') }

        });
    }

    //Nombre del archivo personalizado
    var nombbreArchivo = `${ id }-${new Date().getMilliseconds}.${extencion}`;

    //mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombbreArchivo}`;

    archivo.mv(path, err => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err

            });

        }
        subirportipo(tipo, id, nombbreArchivo, res);

        // res.status(300).json({
        //     ok: true,
        //     mensaje: 'Peticion Realizada Corretamente',
        //     extencion: extencion
        // });

    });

});

function subirportipo(tipo, id, nombbreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No Exite el usuario',
                    errors: { message: "No se puedo Encontrar el Id del Ususario" }

                });
            }

            var pathviejo = '.upload/usuario/' + usuario.img;

            //Si exite elimina la imagen anterior
            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo);

            }
            usuario.img = nombbreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ';)';

                return res.status(300).json({
                    ok: true,
                    mensaje: 'Imagen del usuario Actulizada',
                    usuario: usuarioActualizado
                });

            });
        });



    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {


            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No Exite el medico',
                    errors: { message: "No se puedo Encontrar el Id del Medico" }

                });
            }

            var pathviejo = '.upload/medicos/' + medico.img;

            //Si exite elimina la imagen anterior
            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo);

            }
            medico.img = nombbreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(300).json({
                    ok: true,
                    mensaje: 'Imagen del Medico Actulizada',
                    Medico: medicoActualizado
                });

            });
        });

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {


            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No Exite el Hospital',
                    errors: { message: "No se puedo Encontrar el Id del Hospital" }

                });
            }

            var pathviejo = '.upload/hospitales' + hospital.img;

            //Si exite elimina la imagen anterior
            if (fs.existsSync(pathviejo)) {
                fs.unlink(pathviejo);
            }
            hospital.img = nombbreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(300).json({
                    ok: true,
                    mensaje: 'Imagen del Medico Actulizada',
                    Hospital: hospitalActualizado
                });

            });
        });

    }
}

module.exports = app;