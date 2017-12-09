'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';


/*
	Creación middleware. Se ejecuta antes de la acción del controlador.
	recibe una request y una response como parámetros y el nex que sirve para
	salir del middleware.
*/
exports.ensureAuth = function(req, res, next){
	if (!req.headers.authorization) {
		return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
	}

	//Recogemos el token y le limpiamos las comillas
	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({message: 'El token ha expirado'});	
		}
	}catch(ex){
		console.log(ex);
		return res.status(404).send({message: 'Token no válido'});
	}

	req.user = payload;
	next();
}