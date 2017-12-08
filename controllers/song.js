'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var file = require('../services/file');

function getSong(req, res){
	var songId = req.params.id;
	console.log(req);
	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la petición getSong'});
		}else{
			if (!song) {
				res.status(404).send({message: 'La canción no existe'});
			}else{
				res.status(200).send({song: song});
			}
		}
	});
}

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

function getSongs(req, res){
	var albumId = req.params.album;

	if (!albumId) {
		//Sacar todas las canciones de la bbdd
		var find = Song.find({}).sort('number');

	}else{
		//Sacar los albums de un artista concreto de la bbdd
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err,songs) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición getSongs'});
		}else{
			if (!songs) {
				res.status(404).send({message: 'No hay canciones'});
			}else{
				res.status(200).send({
					songs: songs
				});
			}
		}

	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición updateSong'});
		}else{
			if (!songUpdated) {
				res.status(404).send({message: 'No existe la canción que se intenta actualizar'});
			}else{
				res.status(200).send({
					song: songUpdated
				});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición deleteSong'});
		}else{
			if (!songRemoved) {
				res.status(404).send({message: 'No existe la canción que se intenta eliminar'});
			}else{
				res.status(200).send({
					song: songRemoved
				});
			}
		}
	});
}

function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido ...';

	if (req.files) {
		var file_path = req.files.file.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ex_split = file_path.split('\.');
		var file_ex = ex_split[1];

		if(file_ex == 'mp3' || file_ex == 'ogg'){
			Song.findByIdAndUpdate(songId,{file: file_name},(err, songUpdated) =>{
				if (err) {
					console.log(err);
					res.status(500).send({messaje: 'Error al actualizar la canción'});
				}else{
					if (!songUpdated) {
						res.status(404).send({messaje: 'No se ha podido actualizar la canción'});
					}else{
						res.status(200).send({
							song: songUpdated
						});
					}
				}
			});
		}else{
			file.deleteFile(file_path);
			res.status(200).send({messaje: 'Extensión del archivo no válido'});
		}
	}else{
		res.status(200).send({messaje: 'No ha subido ninguna canción'});
	}
}

function getSongFile(req, res) {
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/' + songFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({messaje: 'No existe la canción...'});			
		}
	});
}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}
