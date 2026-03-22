import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Make sure localhost frontend isn't blocked by CORS
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`📡 New WebSocket connection: ${socket.id}`);
    
    // Allow the frontend to subscribe/listen for a specific assignment ID
    socket.on('join-assignment', (assignmentId) => {
      socket.join(assignmentId);
      console.log(`[Socket] User joined room to wait for Assignment: ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export a helper so our AI Worker can easily ping the frontend from anywhere
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return io;
};
