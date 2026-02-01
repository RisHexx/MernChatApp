import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  //The socket will NOT connect automatically You must manually call: -> socket.connect();
  // so we can control when user connect not directly
  autoConnect: false,
  // use websockets only no polling
  transports: ["websocket"],
});

export default socket;
