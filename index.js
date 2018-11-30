const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidv1 = require('uuid/v1');

const people = {};
const sessions = {}

app.get('*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('join', function(name, pw){
    name = name.toLowerCase();
    if (!people[name]) {
      const sessionId = uuidv1();
      sessions[sessionId] = name;
      people[name] = pw;
      socket.emit('logIn', 'Login Success', sessionId);
    } else if (people[name] && people[name] === pw) {
      const sessionId = uuidv1();
      this.sessions[sessionId] = name;
      socket.emit('logIn', 'Login Success');
    } else {
      socket.emit('logIn', 'Login Failure', sessionId);
    }
	});

  socket.on('chatMessage', function(msg, sessionId){
    io.emit('chatMessage', sessions[sessionId], msg);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});