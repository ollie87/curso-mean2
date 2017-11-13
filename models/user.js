'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

/*
	Se define un objeto User al que se puden asignar valores de UserSchema
	Cuando se guarde el dato en base de datos lo va a gurdar en una colección
	llamada Users y utiliza el esquema definido.
*/
module.exports = mongoose.model('User', UserSchema)