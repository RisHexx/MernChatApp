const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const registerSocket = require("./socket");
require('dotenv').config();


const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("ok");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
