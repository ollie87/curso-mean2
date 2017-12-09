'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'}
});

/*
	Se define un objeto Song al que se puden asignar valores de SongSchema
	Cuando se guarde el dato en base de datos lo va a gurdar en una colección
	llamada Users y utiliza el esquema definido.
*/
module.exports = mongoose.model('Song', SongSchema)