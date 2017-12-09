'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'Artist'}
});

/*
	Se define un objeto Album al que se puden asignar valores de AlbumSchema
	Cuando se guarde el dato en base de datos lo va a gurdar en una colección
	llamada Users y utiliza el esquema definido.
*/
module.exports = mongoose.model('Album', AlbumSchema)