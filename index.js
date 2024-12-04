//Initialize the express 'app' object
let express = require("express");
//Initialize HTTP server
let http = require("http");
let io = require("socket.io");
const dishes = require('./dishes.json');

let app = express();
let server = http.createServer(app);

io = new io.Server(server, {
  maxHttpBufferSize: 20 * 1024 * 1024 // 20 MB (20 * 1024 * 1024 bytes)
});

//Listen for a client to connect and disconnect
io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);

  //Listen for messages from the client
  socket.on('makeDish', (data) => {
    console.log("Received 'makeDish' with the following data:");
    console.log(data);
    const typeDishes = dishes[data]
    let index = Math.floor(Math.random() * typeDishes.length);
    let dish = typeDishes[index];
    console.log("Finish dish with the following data.")
    console.log(dish)
    io.emit('finishDish', dish);
  });

  socket.on('message', (data) => {
    console.log("Received 'message' with the following data:");
    console.log(data);
    socket.broadcast.emit('message', data)
  });


  //Listen for this client to disconnect
  socket.on("disconnect", () => {
    console.log("A client has disconnected: " + socket.id);
  });
});

app.use("/", express.static("public"));

app.get('/data', (req, res) => {
  res.json(dishes);
});

//'port' variable allows for deployment
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
