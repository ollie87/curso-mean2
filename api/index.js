'use strict'



var mongoose = require('mongoose');
var app = require('./app');
//Para definir el puerto en Vagrant
//sudo iptables -I INPUT -p tcp --dport 10201 -j ACCEPT
var port = process.env.PORT || 10201;

//Conexión a base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2',(err,res) =>{
	if (err) {
		throw err;
	}else{
		console.log('La base de datos está funcionando correctamente');

		app.listen(port, function(){
			console.log("Servidor del api rest de música escuchando en http://10.100.1.10:" + port);
		})
	}
});
