var app = require('http').createServer(handler)
	,io = require('socket.io').listen(app)
	,fs = require('fs')

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var people = {};

io.on('connection', function(client){
	client.on('join', function(name){
		people[client.id] = name;
		client.emit('update', "You have connected to the server.");
		client.broadcast.emit('update', name + " has joined the server.")
		io.sockets.emit('update-people', people);
	});

	client.on('send', function(msg){
		io.sockets.emit('chat', people[client.id], msg);
	});

	client.on('disconnect', function(){
		io.sockets.emit('update', people[client.id] + " has left the chat.");
		delete people[client.id];
		io.sockets.emit('update-people', people);
	});
});