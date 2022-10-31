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
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const httpServer = (0, http_1.createServer)();
const port = process.env.PORT || 5500;
const io = new socket_io_1.Server(httpServer, {
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
    console.log(`⚡️[chat-server]: running`);
});
