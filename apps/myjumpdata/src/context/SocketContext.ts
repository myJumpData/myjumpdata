import React from "react";
import { io } from "socket.io-client";

export const socket = io(
  process.env["NODE_ENV"] === "development"
    ? "http://localhost:3000"
    : "https://socket.myjumpdata.fediv.me",
  {
    transports: ["websocket"],
  }
);

const SocketContext = React.createContext(socket);

export default SocketContext;
