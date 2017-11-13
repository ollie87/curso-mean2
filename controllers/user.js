'user strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

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
	user.role = 'ROLE_ADMIN';
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


function checkUser(params){
	var mensaje = {}
	i= 0;
	for(var attrname in params){
		if (params[attrname] == '') {
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
	saveUser
};