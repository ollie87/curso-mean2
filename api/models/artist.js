'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
	name: String,
	description: String,
	image: String
});

/*
	Se define un objeto Artist al que se puden asignar valores de ArtistSchema
	Cuando se guarde el dato en base de datos lo va a gurdar en una colección
	llamada Users y utiliza el esquema definido.
*/
module.exports = mongoose.model('Artist', ArtistSchema)