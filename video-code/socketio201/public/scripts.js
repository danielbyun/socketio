const socket = io("http://localhost:9000"); // the / namespace/endpoint
const admin = io("http://localhost:9000/admin"); // socketio feature

socket.on("messageFromServer", (dataFromServer) => {
  socket.emit("messageToServer", { data: "this is from the client" });
});

admin.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const newMessage = document.querySelector("#user-message").value;
  console.log(newMessage);
  socket.emit("newMessageToServer", { text: newMessage });
});
