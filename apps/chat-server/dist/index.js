"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
dotenv.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const port = process.env.PORT || 5500;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
io.on('connection', (socket) => {
    const room = socket.handshake.auth.room;
    console.log(`socket ${socket.id} connected for ${room}`);
    socket.join(room);
    io.to(room).emit('chat-message', { user: socket.handshake.auth, text: 'has joined the chat', server: true });
    socket.on('chat-message', async (msg) => {
        io.to(room).emit('chat-message', msg);
        if (msg.text.toLowerCase().startsWith("@bot ")) {
            msg.user = { name: 'Bot', color: 'Tomato' };
            msg.server = true;
            try {
                const message = msg.text.substring(5, msg.text.length).trim();
                const openai = new openai_1.OpenAIApi(configuration);
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
                io.to(room).emit('chat-message', msg);
            }
            catch (err) {
                msg.text = "I m not available at this time";
                io.to(room).emit('chat-message', msg);
                console.dir(err);
            }
        }
    });
    socket.on("disconnect", (reason) => {
        io.to(room).emit('chat-message', { user: socket.handshake.auth, text: 'has left the chat', server: true });
        socket.leave(room);
        console.log(`socket ${socket.id} disconnected due to ${reason} for ${room}`);
    });
});
app.get('/', (req, res) => {
    res.send('Welcome to the HTTP Chat Server!');
});
httpServer.listen(port, () => {
    console.log(`⚡️[chat-server]: running`);
});
exports.default = httpServer;
