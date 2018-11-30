const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const people = {};

app.get('*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('join', function(name, pw){
    name = name.toLowerCase();
    if (!people[name]) {
      people[name] = pw;
      socket.emit('logIn', 'Login Success', name);
    } else if (people[name] && people[name] === pw) {
      socket.emit('logIn', 'Login Success', name);
    } else {
      socket.emit('logIn', 'Login Failure');
    }
	});

  socket.on('chatMessage', function(msg, name, color){
    io.emit('chatMessage', name, msg, color);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});