const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
// const { Server } = require("socket.io");

const server = http.createServer(app);

const httpServer = require("http").createServer();
const user = [];

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'https://famous-piroshki-468723.netlify.app',
    credentials:true,   
    // "preflightContinue": false,         //access-control-allow-credentials:true
    optionSuccessStatus:200,
    methods: ["GET", "POST"],
  }
});

// app.use(cors());

// app.get("/", (req, res) => {
//     res.send("server ok");
// }); 

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

  socket.on("specific_user", (data) => {
    console.log("cuba lagi", data.id);
    // socket.broadcast.to(data.id).emit('my_message', "hiiiii")
  })


  socket.on("start_game", (data) => {

    let obj = {};
    obj["cardPlayer"] = data.cardPlayer;
    obj["listUser"] = data.listUser;
    obj["gameDeck"] = data.gameDeck;

    socket.to(data.room).emit("start", obj);

  })

  socket.on("draw_first", (data) => {
    let obj = {}
    obj["card"] = data.card
    obj["listUser"] = data.listUser

    socket.to(data.room).emit("cur_card", obj);
  })

  socket.on("player_draw", (data) => {
    let obj = {}

    console.log("cardDrawed", data.cardDrawed);
    console.log("turn" , data.turn);
    obj["cardDrawed"] = data.cardDrawed
    obj["turn"] = data.turn
    obj["gameDeck"] = data.gameDeck

    if(data.skip){
      obj["skip"] = data.skip;
    }

    socket.to(data.room).emit("player_draw_ws", obj)
  })

  socket.on("player_draw_reverse", (data) => {
    let obj = {};

    console.log("reverse turn", data.turn);

    obj["cardDrawed"] = data.cardDrawed
    obj["turn"] = data.turn
    obj["gameDeck"] = data.gameDeck
    obj["direction"] = data.direction

    socket.to(data.room).emit("player_draw_reverse_ws", obj);
  })

  socket.on("winner", (data) => {
    socket.to(data.room).emit("display_winner", data.winnerId)
  })

  socket.on("plus_two", (data) => {
    console.log("cardDrawed", data.cardDrawed);

    let obj = {}
    obj["cardDrawed"] = data.cardDrawed
    obj["turn"] = data.turn
    obj["gameDeck"] = data.gameDeck

    socket.to(data.room).emit("plus_two_ws", obj)
  })

  socket.on("minus_two_after_player_add", (data) => {
    socket.to(data.room).emit("minus_two_after_player_add_ws", data.gameDeck
    )
  })

  socket.on("take_card", (data) => {
    let obj = {}
    obj["gameDeck"] = data.gameDeck
    obj["turn"] = data.turn

    socket.to(data.room).emit("take_card_ws", obj);
  })

  socket.on("player_draw_change_color", (data) => {
    let obj ={}
    obj["cardDrawed"] = data.cardDrawed
    obj["gameDeck"] = data.gameDeck
    obj["turn"] = data.turn
    obj["changeColor"] = data.changeColor
    obj["cardColor"] = data.cardColor
  
    socket.to(data.room).emit("player_draw_change_color_ws", obj)
  })


  socket.to(1).emit("test", "kambing");

  // socket.on("test", (data) => {
  //   console.log("test", data);
  // });
});

server.listen(3001, () => {
  console.log("SERVER OK");
});
