var fs = require('fs');
var https = require('https');
var WebSocketServer = require('ws').Server;
var express = require("express");
var bodyParser = require("body-parser");
var HOSTIP = process.env.HOSTIP;
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
        wss.broadcast(message);
    });
});

wss.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

app.get(/^(.+)$/, function(req, res){ 
    switch(req.params[0]) {
        case '/voice':
            res.send("selecciono VOICE");
            break;
	case '/menu':
		var body="<html>	<head>		<script type='text/javascript'>			var connection = new WebSocket('wss://"+HOSTIP+"/' );			connection.onmessage = function (e) {               console.log('Server: ' + e.data);};			function enviarMensaje(mensaje){				connection.send(mensaje);				}					</script>	</head>	<body>		<img src='img/opc1.png' alt='Opcion 1' width='80%'>	</body></html>";
		res.send(body);
		break;
    default: res.sendFile( __dirname + req.params[0]); 
    }
 });

console.log('Servidor corriendo');
