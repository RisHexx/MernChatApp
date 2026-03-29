import { io } from "socket.io-client";


const socket = io("/", {
  //The socket will NOT connect automatically You must manually call: -> socket.connect();
  // so we can control when user connect not directly
  autoConnect: false,
  // use websockets only no polling
  transports: ["websocket"],
});

export default socket;
