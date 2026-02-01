const rooms = new Map();

function getRoom(roomCode) {
  return rooms.get(roomCode);
}

function ensureRoom(roomCode, creatorId, durationMinutes, io) {
  let room = rooms.get(roomCode);
  if (!room) {
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    const timerInterval = setInterval(() => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000)
      );

      io.to(roomCode).emit("timer-update", { remainingSeconds });

      if (remainingSeconds <= 0) {
        destroyRoom(roomCode, io, "expired");
      }
    }, 1000);

    room = {
      roomCode,
      users: [],
      expiresAt,
      timerInterval,
      creatorId,
    };
    rooms.set(roomCode, room);
  }
  return room;
}

function addUser(roomCode, user) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.users.push(user);
}

function removeUser(roomCode, socketId) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.users = room.users.filter((u) => u.id !== socketId);
}

async function destroyRoom(roomCode, io, reason = "destroyed") {
  const room = rooms.get(roomCode);
  if (!room) return;

  clearInterval(room.timerInterval);
  rooms.delete(roomCode);

  io.to(roomCode).emit("room-destroyed", { roomCode, reason });

  const sockets = await io.in(roomCode).fetchSockets();
  sockets.forEach((s) => s.disconnect(true));
}

module.exports = {
  rooms,
  getRoom,
  ensureRoom,
  addUser,
  removeUser,
  destroyRoom,
};
