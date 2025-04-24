const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on('connection', socket => {
  console.log('New client connected!!!');

  socket.on('join-room', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;
    console.log('username', username)
    // Send join message as an object to match Message type
    io.to(room).emit('message', {
      from: 'Server',
      text: `${username} has joined the room`
    });
  });

  socket.on('chat', text => {
    // Send chat message as an object with both from and text
    io.to(socket.room).emit('message', {
      from: socket.username,
      text: text
    });
  });

  socket.on('disconnect-user', username => {
    if (socket.room && socket.username) {
      io.to(socket.room).emit('message', {
        from: 'Server',
        text: `${socket.username} left the room`
      });
    }
  });
});

server.listen(8080, () => {
  console.log('✅ Socket.IO server running at http://localhost:8080');
});
