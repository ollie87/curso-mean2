'user strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var file = require('../services/file');


function pruebas(req, res){
	res.status(200).send({
		mensaje: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

function saveUser(req, res){
	var user = new User();

	//Recogemos el post al tener la dependencia body-parser automáticamente lo transforma en JSON
	var params = req.body;
	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	mensaje = checkUser(params);
	if(mensaje['status']){
		if (params.password) {
			//Encriptar Contraseña
			bcrypt.hash(params.password, null, null, function(err, hash){
				user.password = hash;
				user.save((err,userStored) => {
					if (err) {
						res.status(500).send({mensaje: 'Error al guardar el usuario'});
					}else{
						if (!userStored) {
							res.status(500).send({mensaje: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				})
				
			});
		}else{
			res.status(200).send({messaje: 'Introduce la contraseña'});
		}
	}else{
		res.status(200).send(mensaje);
	}
}

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) =>{
		if (err) {
			res.status(500).send({messaje: 'Error en la petición'});
		}else{
			if (!user) {
				res.status(404).send({messaje: 'El usuario no existe'});
			}else{
				//Comprobar la contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if (check) {
						//Devolver datos del usuario logueado
						if (params.gethash) {
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({messaje: 'Contraseña incorrecta'});
					}
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	if (userId != req.user.sub) {
		return res.status(500).send({messaje: 'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err) {
			console.log(err);
			res.status(500).send({messaje: 'Error al actualizar el usuario'});
		}else{
			if (!userUpdated) {
				res.status(404).send({messaje: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({
					user: userUpdated
				});
			}
		}
	});
}

function uploadImages(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		console.log(file_split);
		var ex_split = file_path.split('\.');
		var file_ex = ex_split[1];

		if(file_ex == 'png' || file_ex == 'jpg' || file_ex == 'jpeg' || file_ex == 'gif'){
			User.findByIdAndUpdate(userId,{image: file_name},(err, userUpdated) =>{
				if (err) {
					console.log(err);
					res.status(500).send({messaje: 'Error al actualizar la imagen'});
				}else{
					if (!userUpdated) {
						res.status(404).send({messaje: 'No se ha podido actualizar la imagen'});
					}else{
						res.status(200).send({
							image: file_name,
							user: userUpdated
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
	var path_file = './uploads/users/' + imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({messaje: 'No existe la imagen...'});			
		}
	});
}

function checkUser(params){
	var mensaje = {}
	i= 0;
	for(var attrname in params){
		if (params[attrname] == '' && attrname != '_id' && attrname != 'image') {
			if(!mensaje['campos'])
				mensaje['campos'] = {};
			mensaje['campos'][attrname] = attrname;
			i++;
		}
	}
	if(mensaje.campos){
		mensaje.messaje = 'Introduce todos los campos';
		mensaje.status = false;
	}else{
		mensaje.messaje = 'Correcto';
		mensaje.status = true;
	}

	return mensaje;
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImages,
	getImageFile
};