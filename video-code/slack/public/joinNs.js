joinNs = (endpoint) => {
  // check to see if nsSocket is actually a socket
  if (nsSocket) {
    nsSocket.close();
    // remove the evevntlistener before it's added again
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmission);
  }
  nsSocket = io(`http://localhost:9000${endpoint}`);
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
        // console.log(`someone clicked the room: ${e.target.innerText}`);
        joinRoom(e.target.innerText);
      });
    });
    // add room automatically.. first time here
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;

    joinRoom(topRoomName);
  });

  // message coming from the server
  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);
    const newMsg = buildHTML(msg);
    document.querySelector("#messages").innerHTML += newMsg;
  });

  // listener for the form
  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
};

formSubmission = (event) => {
  event.preventDefault();

  const newMessage = document.querySelector("#user-message").value;
  // console.log(newMessage);
  nsSocket.emit("newMessageToServer", { text: newMessage });
};

buildHTML = (msg) => {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li>
  <div class="user-image">
    <img src="${msg.avatar}" />
  </div>
  <div class="user-message">
    <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
    <div class="message-text">${msg.text}</div>
  </div>
</li>
  `;
  return newHTML;
};
