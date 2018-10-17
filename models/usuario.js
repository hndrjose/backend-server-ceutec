// instalacion de del mongoose
var mongoose = require('mongoose');
// se instala el mongoose-unique-validator previamente
var uniqueValidation = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesvalidos = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un Rol permitido'
}

var usuarioShema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es nesesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es nesesario'] },
    password: { type: String, required: [true, 'El password es nesesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER', enum: rolesvalidos }
});

usuarioShema.plugin(uniqueValidation, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioShema);