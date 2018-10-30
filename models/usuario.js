// instalacion de del mongoose
var mongoose = require('mongoose');

// se instala el mongoose-unique-validator previamente
var uniqueValidation = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// aqui puedo declarar los item para que solo sean aceptado en un campo especifico
var rolesvalidos = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un Rol permitido'
}

var usuarioShema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es nesesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es nesesario'] },
    password: { type: String, required: [true, 'El password es nesesario'] },
    img: { type: String, required: false },
    // con el enum: coloco la validacion correspondiente
    role: { type: String, required: true, default: 'USER', enum: rolesvalidos },
    google: { type: Boolean, default: false }
});

// para mandar la variable que se esta validandao se pone entre llaves {} la palabra PATH en mayuscula
usuarioShema.plugin(uniqueValidation, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioShema);