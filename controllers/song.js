'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var file = require('../services/file');


function saveSong(req, res){
	var song = new Song();

	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar la canción'});
		}else{
			if (!songStored) {
				res.status(404).send({message: 'La canción no ha sido guardada'});	
			}else{
				res.status(200).send({song: songStored});	
			}
		}
	})
}

module.exports = {
	saveSong
}
