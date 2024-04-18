// src/server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { handleSocketEvents } from "./socket";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from frontend origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow cookies and authorization headers
  },
});

const PORT = process.env.PORT || 3001;

// MongoDB setup
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/chatApp"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");
  handleSocketEvents(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
