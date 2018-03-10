'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var file = require('../services/file');

function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err,artist) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición getArtist'});
		}else{
			if (!artist) {
				res.status(404).send({message: 'El artista no existe'});	
			}else{
				res.status(200).send({artist: artist});	
			}
		}
	});
}

function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if (!artistStored) {
				res.status(404).send({message: 'El artista no ha sido guardado'});	
			}else{
				res.status(200).send({artist: artistStored});	
			}
		}
	})
}

function getArtists(req, res){
	if (req.params.page) {
		var page = req.params.page;
	}else{
		var page = 1;
	}
	
	var itemsPerPage = 4;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err,artists, total){
		if (err) {
			res.status(500).send({message: 'Error en la petición getArtists'});
		}else{
			if (!artists) {
				res.status(404).send({message: 'No hay artistas'});	
			}else{
				res.status(200).send({
					total_items: total,
					artists: artists
				});	
			}
		}
	})

}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición updateArtist'});
		}else{
			if (!artistUpdated) {
				res.status(404).send({message: 'El artista no ha sido actualizado'});	
			}else{
				res.status(200).send({artist: artistUpdated});	
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición deleteArtist'});
		}else{
			if (!artistRemoved) {
				res.status(404).send({message: 'El artista no ha sido borrado'});	
			}else{
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
					if (err) {
						res.status(500).send({message: 'Error en la petición updateArtist album'});
					}else{
						if (!albumRemoved) {
							res.status(404).send({message: 'El album no ha sido borrado'});	
						}else{
							Song.find({song: albumRemoved._id}).remove((err, songRemoved)=>{
								if (err) {
									res.status(500).send({message: 'Error en la petición updateArtist song'});
								}else{
									if (!songRemoved) {
										res.status(404).send({message: 'La canción no ha sido borrada'});	
									}else{
										res.status(200).send({artist: artistRemoved});	
									}
								}
							});	
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido ...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ex_split = file_path.split('\.');
		var file_ex = ex_split[1];

		if(file_ex == 'png' || file_ex == 'jpg' || file_ex == 'jpeg' || file_ex == 'gif'){
			Artist.findByIdAndUpdate(artistId,{image: file_name},(err, artistUpdated) =>{
				if (err) {
					console.log(err);
					res.status(500).send({messaje: 'Error al actualizar la imagen'});
				}else{
					if (!artistUpdated) {
						res.status(404).send({messaje: 'No se ha podido actualizar la imagen'});
					}else{
						res.status(200).send({
							artist: artistUpdated
						});
					}
				}
			});
		}else{
			file.deleteFile(file_path);
			res.status(500).send({messaje: 'Extensión del archivo no válido'});
		}
	}else{
		res.status(200).send({messaje: 'No ha subido ninguna imagen'});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/' + imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({messaje: 'No existe la imagen...'});			
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};