// External libraries
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import assignmentRoutes from './routes/assignmentRoutes';
import './workers/aiWorker';
import { initSocket } from './lib/socket';

// Read all the secret keys from the .env file we just made
dotenv.config();

// Initialize the Express router and underlying HTTP server for WebSockets
const app = express();
const server = http.createServer(app);

// Start our real-time notification server
initSocket(server);

const PORT = process.env.PORT || 5000;

// Middleware (Helpers)
app.use(cors()); // Allows our Next.js frontend to talk to this backend without security blocks
app.use(express.json()); // Tells Express to parse incoming JSON data from our Create Form

// Base Route (Just to check if the server is alive)
app.get('/', (req, res) => {
  res.send('VedaAI Backend is running!');
});

// Assignment API Routes
app.use('/api/assignments', assignmentRoutes);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // 1. Connect to the database using the URL from .env
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Successfully connected to MongoDB');

    // 2. Start listening for network requests (and WebSockets!)
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
  }
};

startServer();
