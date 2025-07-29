// socket.js
import { io } from "socket.io-client";
import { BaseUrl } from "@/ipconfig";

let socket = null;

export function connectSocket() {
  const token = localStorage.getItem("token");

  if (!socket) {
    socket = io(`${BaseUrl}/chat`, {
      auth: { token },
      autoConnect: true,
      transports: ["websocket"],
    });
  }

  return socket;
}

export function getSocket() {
  return socket;
}
