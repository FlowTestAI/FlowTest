import { io } from "socket.io-client";

export function socketConnection() {
  const socket = io();

  socket.on('alpha', function(msg) {
    console.log(`message from server: ${msg}`)
    console.log(socket.id); // undefined
  });

  return socket;
}