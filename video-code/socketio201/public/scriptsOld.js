const socket = io("http://localhost:9000"); // the / namespace/endpoint
const admin = io("http://localhost:9000/admin"); // socketio feature

// first socket
socket.on("connect", () => {
  console.log(socket.id);
});

admin.on("connect", () => {
  console.log(admin.id);
});

admin.on("welcome", (msg) => {
  console.log(msg);
});

socket.on("messageFromServer", (dataFromServer) => {
  socket.emit("messageToServer", { data: "this is from the client" });
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const newMessage = document.querySelector("#user-message").value;
  console.log(newMessage);
  socket.emit("newMessageToServer", { text: newMessage });
});

socket.on("messageToClients", (msg) => {
  console.log(msg);
  document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
});
