const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const people = {};

app.get('*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('join', function(name, pw){
    if (!people[name]) {
      people[name] = pw;
      socket.emit('logIn', 'Login Success', name);
    } else if (people[name] && people[name] === pw) {
      socket.emit('logIn', 'Login Success', name);
    } else {
      socket.emit('logIn', 'Login Failure');
    }
	});

  socket.on('chatMessage', function(msg, name){
    io.emit('chatMessage', name, msg);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});