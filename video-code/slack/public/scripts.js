const socket = io("http://localhost:9000"); // the / namespace/endpoint

socket.on("connect", () => {
  console.log(socket.id);
});

// listen for nsList, which is list of all the namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived:, " + nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";

  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}>
    <img src="${ns.img}"/>
    </div>`;
  });

  // add a clicklistener for each namespaces
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    // console.log(elem);
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(`${nsEndpoint}: should be here`);
    });
  });
  const nsSocket = io("http://localhost:9000/wiki");
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    console.log(nsRooms);
    const roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";

    nsRooms.forEach((nsRoom) => {
      let glyph;
      nsRoom.privateRoom ? (glyph = "lock") : (glyph = "globe");
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}">${nsRoom.roomTitle}</span></li>`;
    });

    // add click listner to each room
    const roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log(`someone clicked the room: ${e.target.innerText}`);
      });
    });
  });
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
