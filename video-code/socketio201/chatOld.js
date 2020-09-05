const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on === io.of('/').on
io.of("/").on("connection", (socket) => {
  console.log("root connection");
  socket.emit("messageFromServer", { data: "Welcome to the socket io server" });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.on("newMessageToServer", (msg) => {
    console.log(msg);

    // does the same thing but the second line adds namespace (room)
    // io.emit("messageToClients", { text: msg.text });
    io.of("/").emit("messageToClients", { text: msg.text });
  });

  // the server can still communicate across namspaces, but on the client, the socket needs to be in that namespace in order to get the events
  io.of("/admin").emit(
    "welcome",
    "WElcome to the admin channel from the main channel"
  );
});

io.of("/admin").on("connection", (socket) => {
  console.log("someone connected to the admin name");
  io.of("/admin").emit("welcome", "welcome to the admin channel");
});
