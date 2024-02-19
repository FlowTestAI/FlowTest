import { io } from 'socket.io-client';

export function socketConnection() {
  const socket = io();

  socket.on('collection tree', function (collections) {
    console.log(`collections from server: ${JSON.stringify(collections)}`);
  });

  return socket;
}
