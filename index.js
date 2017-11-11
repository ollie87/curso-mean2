'use strict'

var mongoose = require('mongoose');

mongoose.conect('mongodb//127.0.0.1:27017//curso_mean2',(err,res) =>{
	if (err) {
		throw err;
	}else{
		console.log('La base de datos está corriendo');
	}
});
