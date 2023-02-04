const Sqlssb = require('sqlssb')
const WebSocket = require("ws");
var express = require('express');
const http = require('http');
var app = express();
const port = 8081
const clientTracking = true

app.use(express.json({
  limit: '10kb'
}))

app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}))

const server = http.createServer(app)

app.get('/ws', function(req, res) {
  // res.send('Hello World Online School!');
  	console.log("Connecting Socket===========")
  	
});

server.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});


const service1 = new Sqlssb({
  user: 'sa',
  password: 'P@ssw0rd',
  server: 'localhost',
  database: 'TestNotify',
  service: 'NotificationService',
  queue: 'NotificationQueue'
})
 


const wsServer = new WebSocket.Server({
	clientTracking,
    server
});

wsServer.on('connection', (socket) => {
	console.log("Socket Connection Established!")
	// socket.send('Welcome to the chat, enjoy :)');
	app.locals.clients = wsServer.clients;
	//console.log(app.locals.clients)
  service1.on('ReceivedNotification', ctx => {
    console.log(ctx.conversationId);
    console.log(ctx.messageBody);
    console.log(ctx.messageTypeName);
    console.log(ctx.messageSequenceNumber);
    console.log(ctx.serviceName);
    socket.send(ctx.messageBody);
  })
   
  service1.start({ //default settings:
    timeout: 5000, //5 seconds
    count: 1 //one message at a time
  })
	// socket.send("{\"title\":\"Welcome\",\"body\":\"Web Socket Connection Established\"}");
  // verifySocketToken(socket, socketUtility);
});