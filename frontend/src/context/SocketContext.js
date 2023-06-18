import React, { createContext } from "react";
import { useSocket } from "../hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { socket, online } = useSocket(
    `${
      process.env.NODE_ENV !== "production"
        ? process.env.REACT_APP_URL_SERVER
        : window.origin.replace(":3000", ":4000")
    }`
  );
  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
