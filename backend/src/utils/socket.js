import { Server } from "socket.io";

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
  });

  return io;
}

export function emitPaymentUpdate(payload) {
  if (!io) return;
  io.emit("payment_update", payload);
}
