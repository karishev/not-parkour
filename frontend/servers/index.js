let socket = io("/servers");

window.addEventListener("load", () => {
  sessionStorage.setItem("room", 12324);
  let noRooms = document.querySelector(".noRooms");
  let serversDiv = document.querySelector(".serversInfo");
  let serverss = document.querySelectorAll(".server1");
  socket.on("connect", () => {
    socket.on("servers", (data) => {
      let dataReceived = [];
      console.log(data);
      for (const [key, value] of Object.entries(data)) {
        dataReceived.push(key);
      }

      if (dataReceived.length > 0) {
        noRooms.style.display = "none";
      } else {
        noRooms.style.display = "block";
      }

      serverss = document.querySelectorAll(".server1");

      serverss.forEach((di) => {
        let roomNum = di.children[0].children[0].innerHTML;
        if (!dataReceived.includes(roomNum)) {
          di.parentNode.removeChild(di);
        } else {
          dataReceived = dataReceived.filter((item) => item !== roomNum);
        }
      });

      dataReceived.forEach((item) => {
        let serverContainer = document.createElement("div");
        serverContainer.classList.add("server1");
        let roomName = document.createElement("span");
        roomName.innerHTML = item;
        let roomNameFull = document.createElement("h4");
        roomNameFull.innerHTML = "Room Name: ";
        roomNameFull.appendChild(roomName);

        let serverInfo = document.createElement("div");
        // serverInfo.innerHTML = `<button class='connectBtn' onclick='redirectServer(${item})'>Connect</button> <h4>1/2</h4>`;
        serverInfo.innerHTML = `<button class='connectBtn' onclick=redirectServer('${item}')>Connect</button> <h4>1/2</h4>`;
        serverInfo.classList.add("server__connect");

        serverContainer.appendChild(roomNameFull);
        serverContainer.appendChild(serverInfo);
        serversDiv.appendChild(serverContainer);
      });
    });
  });
});

function redirectServer(roomName) {
  console.log(roomName);
  sessionStorage.setItem("room", roomName);
  let loc = String(window.location.href);
  window.location.href = loc.slice(0, loc.indexOf("servers")) + "/room";
}

function getBack() {
  let loc = String(window.location.href);
  window.location.href = loc.slice(0, loc.indexOf("servers"));
}
