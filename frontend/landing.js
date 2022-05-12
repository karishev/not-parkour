let clickSound = document.querySelector(".click");

window.addEventListener("load", () => {
  clickSound = document.querySelector(".click");
  let musica = document.querySelector(".musica");
  musica.volume = 0.5;
  // musica.play();
  let socket = io();
  sessionStorage.setItem("room", 12324);
  //   sessionStorage.setItem("id", socket.id);
  let roomNumber = document.getElementById("room__name");
  const joining = document.getElementById("joining");
  const creating = document.getElementById("create");

  joining.addEventListener("click", () => {
    clickSound.play();
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
    clickSound.play();
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

function displayInstructions() {
  clickSound.play();
  let musica = document.querySelector(".musica");
  musica.play();
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

function switchMusic() {
  clickSound.play();
  let musicOn = document.querySelector(".musicOn");
  let musicOff = document.querySelector(".musicOff");
  let musica = document.querySelector(".musica");

  if (musicOn.style.display == "none") {
    musicOff.style.display = "none";
    musicOn.style.display = "block";
    musica.muted = false;
  } else {
    musicOff.style.display = "block";
    musicOn.style.display = "none";
    musica.muted = true;
  }
}

function displayServers() {
  window.location.href = "/servers";
}
