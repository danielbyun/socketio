const username = prompt("What is your username?");

// const socket = io("http://localhost:9000"); // the / namespace/endpoint
const socket = io("http://localhost:9000", {
  query: {
    username,
  },
});
let nsSocket = "";

socket.on("connect", () => {
  // console.log(socket.id);
});

// listen for nsList, which is list of all the namespaces
socket.on("nsList", (nsData) => {
  // console.log("The list of namespaces has arrived:, " + nsData);
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
      // console.log(`${nsEndpoint}: should be here`);
      joinNs(nsEndpoint);
    });
  });
  joinNs("/wiki");
});
