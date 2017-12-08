'use stict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');


app.use(bodyParser.urlencoded({extend:false}));
//Transforma las peticiones del servidor en objetos json
app.use(bodyParser.json())

//configurar cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); //Permitimos el acceso a todos los dominios
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'); //Necesarias para el acceso ajax a la APi
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); //Métodos permitidos
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE'); //Métodos permitidos

	next();

});	



//carga de rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


//exportamos el módulo para poder utilizar express en otros ficheros que incluyan app
module.exports = app;