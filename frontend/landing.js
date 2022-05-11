window.addEventListener("load", () => {
  // let musica = document.querySelector(".musica");
  // musica.play();
  let socket = io();
  sessionStorage.setItem("room", 12324);
  //   sessionStorage.setItem("id", socket.id);
  let roomNumber = document.getElementById("room__name");
  const joining = document.getElementById("joining");
  const creating = document.getElementById("create");

  joining.addEventListener("click", () => {
    if (roomNumber.value == "") {
      alert("write a room name");
      return;
    }
    socket.emit("checkRoom", { id: socket.id, room: roomNumber.value });
    socket.on("checkedRoom", (data) => {
      if (data.create == "no") {
        alert("no such room name!");
        return;
      } else if (data.create == "full") {
        alert("the room is full!");
      } else {
        sessionStorage.setItem("room", roomNumber.value);
        window.location.href = window.location.href + "/room";
      }
    });
  });

  creating.addEventListener("click", () => {
    if (roomNumber.value == "") {
      alert("write a room name");
      return;
    }
    socket.emit("creatingRoom", { id: socket.id, room: roomNumber.value });
    socket.on("createdRoom", (data) => {
      console.log(data);
      if (data.create == "no") {
        alert("there is a room with such name");
        return;
      } else {
        sessionStorage.setItem("room", roomNumber.value);
        window.location.href = window.location.href + "/room";
      }
    });
  });
});

window.addEventListener("click", (e) => {
  let musica = document.querySelector(".musica");
  musica.play();
});

function displayInstructions() {
  instructions = document.getElementById("popup__image");
  if (instructions.style.display == "none") {
    instructions.style.display = "block";
    document.getElementById("instructions__btn").style.backgroundColor =
      "var(--darker-brown)";
    document.getElementById("instructions__btn").style.color = "var(--brown)";
  } else if ((instructions.style.display = "block")) {
    instructions.style.display = "none";
    document.getElementById("instructions__btn").style.backgroundColor =
      "var(--brown)";
    document.getElementById("instructions__btn").style.color =
      "var(--darker-brown)";
  }
}

function displayServers() {
  window.location.href = "/servers";
}
