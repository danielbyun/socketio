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

joinRoom = (roomName) => {
  // send this roomName to the server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // update the room member total now that we have someone joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });
  nsSocket.on("historyCatchUp", (history) => {
    // console.log(history);
    // update the DOM
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";

    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;

      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });
  nsSocket.on("updateMembers", (numMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerHTML = `${roomName}`;
  });

  // search box #search-box
  const searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    const { value } = e.target;
    const messages = Array.from(
      document.getElementsByClassName("message-text")
    );
    console.log(messages);
    messages.forEach((msg) => {
      msg.innerText.toLowerCase().indexOf(value.toLowerCase()) === -1
        ? (msg.style.display = "none")
        : (msg.style.display = "block");
    });
  });
};
