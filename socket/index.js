var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.end("test");
});

io.on("connection", (socket) => {
  socket.on("test", (args) => {
    console.log(args);
  });
});

http.listen(80, () => {
  console.log("listening on *:80");
});
