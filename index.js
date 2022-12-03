const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);
const user = [];

const io = new Server(server, {
  cors: {
    // origin: `https://famous-piroshki-468723.netlify.app`,
    origin: `http://localhost:3000`,

    // https://stately-torrone-f0cacf.netlify.app
    // http://localhost:3000
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("server ok");
});

let arr = [];

io.on("connection", (socket) => {
  // console.log(`User Connected ${socket.id}`);
  console.log("socket info", socket.id);
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("join_room", (data) => {
    
    // const key = Object.keys(a);
    console.log("data room",data.room);
    
    socket.join(data.room);
    var a = io.sockets.adapter.rooms;
    // console.log("dh ada", key);
    var c = null;

    for (let [key, value] of a) {
      var b = Array.from(value);
      // let c = b.split(',');
      if(key == data.room){
        c = b
      }
      // b.forEach(ele => {
      //   c.push(ele)
      // })
      console.log(key + " = " + b);
    }


var z = {};
z["id"] = socket.id
z["name"] = data.name
    socket.to(data.room).emit("user_join", z);

    console.log("harluuu", io.sockets.adapter.rooms.get(data.room).size);

    const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
    var k = {};
    k["c"] = c;
    k["usernameList"] = data.name
    socket.to(data.room).emit("list_user", k);
    // console.log(sockets);

    //game start
  });

  socket.on("specific_user", (data) => {
    console.log("cuba lagi", data.id);
    // socket.broadcast.to(data.id).emit('my_message', "hiiiii")
  });

  socket.on("start_game", (data) => {
    let obj = {};
    obj["cardPlayer"] = data.cardPlayer;
    obj["listUser"] = data.listUser;
    obj["gameDeck"] = data.gameDeck;
    obj["usernameList"] = data.listUsername

    socket.to(data.room).emit("start", obj);
  });

  socket.on("draw_first", (data) => {
    let obj = {};
    obj["card"] = data.card;
    obj["listUser"] = data.listUser;

    socket.to(data.room).emit("cur_card", obj);
  });

  socket.on("player_draw", (data) => {
    let obj = {};

    console.log("cardDrawed", data.cardDrawed);
    console.log("turn", data.turn);
    obj["cardDrawed"] = data.cardDrawed;
    obj["turn"] = data.turn;
    obj["gameDeck"] = data.gameDeck;

    if (data.skip) {
      obj["skip"] = data.skip;
    }

    socket.to(data.room).emit("player_draw_ws", obj);
  });

  socket.on("player_draw_reverse", (data) => {
    let obj = {};

    console.log("reverse turn", data.turn);

    obj["cardDrawed"] = data.cardDrawed;
    obj["turn"] = data.turn;
    obj["gameDeck"] = data.gameDeck;
    obj["direction"] = data.direction;

    socket.to(data.room).emit("player_draw_reverse_ws", obj);
  });

  socket.on("winner", (data) => {
    socket.to(data.room).emit("display_winner", data.winnerId);
  });

  socket.on("plus_two", (data) => {
    console.log("cardDrawed", data.cardDrawed);

    let obj = {};
    obj["cardDrawed"] = data.cardDrawed;
    obj["turn"] = data.turn;
    obj["gameDeck"] = data.gameDeck;

    socket.to(data.room).emit("plus_two_ws", obj);
  });

  socket.on("minus_two_after_player_add", (data) => {
    socket.to(data.room).emit("minus_two_after_player_add_ws", data.gameDeck);
  });

  socket.on("take_card", (data) => {
    let obj = {};
    obj["gameDeck"] = data.gameDeck;
    obj["turn"] = data.turn;

    socket.to(data.room).emit("take_card_ws", obj);
  });

  socket.on("player_draw_change_color", (data) => {
    let obj = {};
    obj["cardDrawed"] = data.cardDrawed;
    obj["gameDeck"] = data.gameDeck;
    obj["turn"] = data.turn;
    obj["changeColor"] = data.changeColor;
    obj["cardColor"] = data.cardColor;

    socket.to(data.room).emit("player_draw_change_color_ws", obj);
  });

  socket.to(1).emit("test", "kambig");

  socket.on('send_chat', (data) => {
    let obj = {};

    obj["user"] =data.user;
    obj["chat"] = data.chat;

    socket.to(data.room).emit("send_chat_ws", obj);
  })

  // socket.on("test", (data) => {
  //   console.log("test", data);
  // });
});

const host = "0.0.0.0";
const port = process.env.PORT || 3001;

server.listen(port, host, function () {
  console.log("Server started.......");
});
