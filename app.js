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


//carga de rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


//exportamos el módulo para poder utilizar express en otros ficheros que incluyan app
module.exports = app;