import { createServer } from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const app = express()
const httpServer = createServer(app);
const port = process.env.PORT || 5500;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});


io.on('connection', (socket) => {
  const room = socket.handshake.auth.room;
  console.log(`socket ${socket.id} connected for ${room}`);

  socket.join(room);
  io.to(room).emit('chat-message', { user: socket.handshake.auth, text: 'has joined the chat', server: true });

  socket.on('chat-message', (msg) => {
    io.to(room).emit('chat-message', msg);
  });

  socket.on("disconnect", (reason) => {
    io.to(room).emit('chat-message', { user: socket.handshake.auth, text: 'has left the chat', server: true });
    socket.leave(room);

    console.log(`socket ${socket.id} disconnected due to ${reason} for ${room}`);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the HTTP Chat Server!')
})


httpServer.listen(port, () => {
  console.log(`⚡️[chat-server]: running`);
});

export default httpServer;