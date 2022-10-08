const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let arr = [];

io.on("connection", (socket) => {
  // console.log(`User Connected ${socket.id}`);
  console.log("socket info", socket.id);
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  
  socket.on("join_room", (room) => {
      
        console.log("dh ada", io.sockets.adapter.rooms);
        socket.join(room);

        socket.to(room).emit("user_join", socket.id);

    const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
    socket.to(room).emit("list_user", sockets);
    console.log(sockets);

    //game start
  });

  socket.on("start_game", (data) => {
    socket.to(data.room).emit("start", true);
  })


  socket.to(1).emit("test", "kambing");

  // socket.on("test", (data) => {
  //   console.log("test", data);
  // });
});

server.listen(3001, () => {
  console.log("SERVER OK");
});
