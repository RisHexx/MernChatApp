const http = require("http");
const { Server } = require("socket.io");
const registerSocket = require("./socket");
require("dotenv").config();

const app = require("./app"); // 👈 import app

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