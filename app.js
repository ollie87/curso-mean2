'use stict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
app.use(bodyParser.urlencoded({extend:false}));
//Transforma las peticiones del servidor en objetos json
app.use(bodyParser.json())

//configurar cabeceras http


//carga de rutas base

app.get('/pruebas', function(req,res){
	res.status(200).send({message: 'Curso mean2'})
});

//exportamos el módulo para poder utilizar express en otros ficheros que incluyan app
module.exports = app;