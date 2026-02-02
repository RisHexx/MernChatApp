const {
  getRoom,
  ensureRoom,
  addUser,
  removeUser,
  destroyRoom,
} = require("./rooms");

function registerSocket(io) {
  io.on("connection", (socket) => {


    socket.on("join-room", (payload) => {
      const { username, roomCode, duration } = payload || {};
      if (!username || !roomCode || !duration) return;

      const room = ensureRoom(roomCode, socket.id, Number(duration), io);
      const isCreator = room.creatorId === socket.id;

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.username = username;

      addUser(roomCode, { id: socket.id, username });

      const remainingSeconds = Math.max(
        0,
        Math.ceil((room.expiresAt - Date.now()) / 1000)
      );

      socket.emit("room-joined", {
        roomCode,
        username,
        isCreator,
        remainingSeconds,
      });
    });

    socket.on("send-message", (payload) => {
      const { roomCode, text } = payload || {};
      if (!roomCode || !text) return;
      const room = getRoom(roomCode);
      if (!room) return;

      const message = {
        //random id for message for react warning to have id.
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderId: socket.id,
        username: socket.data.username || "unknown",
        text: String(text),
        createdAt: Date.now(),
      };

      io.to(roomCode).emit("message", message);
    });

    socket.on("destroy-room", async (payload) => {
      const { roomCode } = payload || {};
      const room = getRoom(roomCode);
      if (!room) return;

      //checking only admin can destry room
      if (room.creatorId !== socket.id) return;
      await destroyRoom(roomCode, io, "manual");
    });

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      removeUser(roomCode, socket.id);
    });
  });
}

module.exports = registerSocket;
