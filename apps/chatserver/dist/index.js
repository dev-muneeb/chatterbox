import { createServer } from 'http';
import { Server } from 'socket.io';
const httpServer = createServer();
const port = 5500;
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
httpServer.listen(port, () => {
    console.log(`⚡️[chatserver]: running`);
});
