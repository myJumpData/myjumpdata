import React from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const SocketContext = React.createContext(socket);

export default SocketContext;
