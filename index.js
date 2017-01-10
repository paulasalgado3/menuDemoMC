var fs = require('fs');
var https = require('https');
var WebSocketServer = require('ws').Server;
var express = require("express");
var bodyParser = require("body-parser");
var HOSTIP = process.env.HOSTIP;
var DOMINIO = process.env.DOMINIO;
var serverConfig = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

var app = express();
var HTTPS_PORT = 8080;

var httpsServer = https.createServer(serverConfig, app).listen(HTTPS_PORT);

var wss = new WebSocketServer({server: httpsServer});

wss.on('connection', function(wss) {
	wss.send('conectado');
    wss.on('message', function(message) {
    });
});

function enviarMensaje(mensaje){
 wss.clients.forEach(function each(client){
			console.log(mensaje);
                        client.send(mensaje);
                });
};

app.get(/^(.+)$/, function(req, res){ 
    switch(req.params[0]) {
        case '/opc1':
            res.send("selecciono OPCION 1");
	    enviarMensaje("opc1");
            break;
	case '/menu':
		var body="<html>	<head>		<script type='text/javascript'>			var connection = new WebSocket('wss://"+HOSTIP+"/' );			connection.onmessage = function (e) {               console.log('Server: ' + e.data); switch (e.data) {case 'opc1': window.location = 'https://speech-"+DOMINIO+"/imagen'; break; default: }};			function enviarMensaje(mensaje){				connection.send(mensaje);				}					</script>	</head>	<body style='margin:2px'>		<img src='img/opc1.png' alt='Opcion 1' height='14%' width='80%' style='border:0px;margin:0px;clear:both'> <img src='img/opc2.png' alt='Opcion 2' height='14%' width='80%' style='border:0px;margin:0px;clear:both'> <img src='img/opc3.png' alt='Opcion 3' height='14%' width='80%' style='border:0px;margin:0px;clear:both'>	<img src='img/opc4.png' alt='Opcion 4' height='14%' width='80%' style='border:0px;margin:0px;clear:both'> <img src='img/opc5.png' alt='Opcion 5' height='14%' width='80%' style='border:0px;margin:0px;clear:both'> <img src='img/opc6.png' alt='Opcion 6' height='14%' width='80%' style='border:0px;margin:0px;clear:both'></body></html>";
		res.send(body);
		break;
    default: res.sendFile( __dirname + req.params[0]); 
    }
 });

console.log('Servidor corriendo');
