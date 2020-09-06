const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on === io.of('/').on
io.of("/").on("connection", (socket) => {
  // build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  // console.log(nsData);
  // send the nsData back to the client
  // we need to use socket, NOT io, because we want it to go to just the client
  socket.emit("nsList", nsData);
});

io.of("/admin").on("connection", (socket) => {
  console.log("someone connected to the admin name");
  io.of("/admin").emit("welcome", "welcome to the admin channel");
});

let namespaces = require("./data/namespaces");
console.log(namespaces);

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  // console.log(namespace);
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
  });
});
