// we need http because we dont have express
const http = require("http");

// we need socketio it's a 3rd party
const socketio = require("socket.io");

// make / setup http server with node
const server = http.createServer((req, res) => {
  res.end("<h1>I am connected</h1>");
});

const io = socketio(server);

io.on("connection", (socket, req) => {
  // ws.send because socket.emit
  socket.emit("welcome", "welcome to the socketio!!");
  socket.on("message", (msg) => {
    console.log(msg);
  });
});

// listen to port 8000
server.listen(8000);
