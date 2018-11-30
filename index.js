const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('join', function(name){
    people[socket.id] = name;
	});

  socket.on('chat message', function(msg){
    io.emit('chat message', people[socket.id], msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});