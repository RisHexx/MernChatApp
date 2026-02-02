const rooms = new Map();

function getRoom(roomCode) {
  return rooms.get(roomCode);
}

function ensureRoom(roomCode, creatorId, durationMinutes, io) {
  let room = rooms.get(roomCode);
  if (!room) {

    //calculate when room will expire from now.
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;

    // this will run every second
    // we broadcast how many seconds left to everyone in room
    const timerInterval = setInterval(() => {

      // subtracting current to when its going to expire and dividing by 1000 to convert miliseconds into seconds and ceil to 3.4 -> will be 4 seconds not skipping of seconds
      const remainingSeconds = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000)
      );


      //broadcasting to everyone
      io.to(roomCode).emit("timer-update", { remainingSeconds });

      // if expires destroy the room
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
