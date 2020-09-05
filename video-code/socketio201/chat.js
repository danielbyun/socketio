const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on === io.of('/').on
io.of("/").on("connection", (socket) => {
  socket.emit("messageFromServer", { data: "Welcome to the socket io server" });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log("someone connected to the admin name");
  io.of("/admin").emit("welcome", "welcome to the admin channel");
});
