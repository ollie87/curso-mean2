'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var file = require('../services/file');

function getAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err,album) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición getAlbum'});
		}else{
			if (!album) {
				res.status(404).send({message: 'El album no existe'});	
			}else{
				res.status(200).send({album: album});	
			}
		}
	});
}

function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumtStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el album'});
		}else{
			if (!albumtStored) {
				res.status(404).send({message: 'El album no ha sido guardado'});	
			}else{
				res.status(200).send({album: albumtStored});	
			}
		}
	})
}

module.exports = {
	getAlbum,
	saveAlbum
}