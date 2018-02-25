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

function getAlbums(req, res){
	var artistId = req.params.artist;

	if (!artistId) {
		//Sacar todos los albums de la bbdd
		var find = Album.find({}).sort('title');

	}else{
		//Sacar los albums de un artista concreto de la bbdd
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err,albums) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición getAlbums'});
		}else{
			if (!albums) {
				res.status(404).send({message: 'No hay albums'});
			}else{
				res.status(200).send({
					albums: albums
				});
			}
		}

	});
}

function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición updateAlbum'});
		}else{
			if (!albumUpdated) {
				res.status(404).send({message: 'No existe el album que se intenta actualizar'});
			}else{
				res.status(200).send({
					album: albumUpdated
				});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
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
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var file_name = 'No subido ...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ex_split = file_path.split('\.');
		var file_ex = ex_split[1];

		if(file_ex == 'png' || file_ex == 'jpg' || file_ex == 'jpeg' || file_ex == 'gif'){
			Album.findByIdAndUpdate(albumId,{image: file_name},(err, albumUpdated) =>{
				if (err) {
					console.log(err);
					res.status(500).send({messaje: 'Error al actualizar la imagen'});
				}else{
					if (!albumUpdated) {
						res.status(404).send({messaje: 'No se ha podido actualizar la imagen'});
					}else{
						res.status(200).send({
							artist: albumUpdated
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
	var path_file = './uploads/albums/' + imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({messaje: 'No existe la imagen...'});			
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}
