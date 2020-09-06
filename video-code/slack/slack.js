const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on === io.of('/').on
io.of("/").on("connection", (socket) => {
  // console.log(socket.handshake);
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
  // console.log("someone connected to the admin name");
  io.of("/admin").emit("welcome", "welcome to the admin channel");
});

let namespaces = require("./data/namespaces");
// console.log(namespaces);

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  // console.log(namespace);
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    const username = nsSocket.handshake.query.username;
    console.log(`${username} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      // console.log("leave all rooms");
      // console.log(nsSocket.rooms);
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInroom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      // io.of(namespace.endpoint)
      //   .in(roomToJoin)
      //   .clients((err, clients) => {
      //     console.log(clients.length);
      //     numberOfUsersCallback(clients.length);
      //   });
      // deal with history here
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      // send out the room's history
      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersInroom(namespace, roomToJoin);
    });
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username,
        avatar: "https://via.placeholder.com/30",
      };
      // console.log(msg);
      // send the message to all the sockets thare in the room that THIS socket is in
      // how can we find out what room THIS socket is in??
      // console.log(nsSocket.rooms);
      // the user will be in the 2nd room in the object list
      // because the socket ALWAYS joins its own room on connection
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // console.log(roomTitle);

      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });

      // console.log(
      //   "The room object that we made that matches this NS room is..."
      // );
      // console.log(nsRoom);

      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});

updateUsersInroom = (namespace, roomToJoin) => {
  // send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((err, clients) => {
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit("updateMembers", clients.length);
    });
};
