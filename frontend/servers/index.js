let socket = io("/servers");

window.addEventListener("load", () => {
  socket.on("connect", () => {
    socket.on("servers", (data) => {
      console.log(data);
    });
  });
});
