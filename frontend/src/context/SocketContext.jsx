import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveAlert, setLiveAlert] = useState(null);

  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);

    s.on('newEmergencyRequest', (request) => {
      setLiveAlert({
        type: 'danger',
        message: `🚨 NEW SOS: ${request.title} (${request.emergencyType}) at ${request.address}`,
        timestamp: new Date()
      });
    });

    s.on('requestStatusUpdated', (request) => {
      setLiveAlert({
        type: 'info',
        message: `ℹ️ UPDATE: Request "${request.title}" is now ${request.status}`,
        timestamp: new Date()
      });
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, liveAlert, clearAlert: () => setLiveAlert(null) }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
