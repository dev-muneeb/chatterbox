import { createServer } from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv'
import express from 'express'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()
const app = express()
const httpServer = createServer(app);
const port = process.env.PORT || 5500;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

io.on('connection', (socket) => {
  const room = socket.handshake.auth.room;
  console.log(`socket ${socket.id} connected for ${room}`);

  socket.join(room);
  io.to(room).emit('chat-message', { user: socket.handshake.auth, text: 'has joined the chat', server: true });

  socket.on('chat-message', async (msg) => {
    io.to(room).emit('chat-message', msg);
    if (msg.text.toLowerCase().startsWith("@bot "))
    {
      const message = msg.text.substring(5, msg.text.length).trim();
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-ada-001",
        prompt: message,
        max_tokens: 200,
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
      });
      msg.text = response?.data.choices.map(c => c.text).join(' ');
      msg.user = { name: 'Bot', color: 'Tomato' }
      msg.server = true;
      io.to(room).emit('chat-message', msg);
    }
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