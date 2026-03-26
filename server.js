const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("chat", {
      user: "System",
      message: `${username} joined the chat`
    });
  });

  // Receive message
  socket.on("sendMessage", (message) => {
    io.emit("chat", {
      user: users[socket.id],
      message
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];

    io.emit("chat", {
      user: "System",
      message: `${username} left the chat`
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});