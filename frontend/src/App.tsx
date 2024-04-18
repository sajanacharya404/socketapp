import React, { useState } from "react";
import io from "socket.io-client";
import LoginForm from "./components/LoginForm";
import ChatRoom from "./components/ChatRoom";
import axios from "axios";

const socket = io("http://localhost:3001");

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null); // State to store room ID
  const [roomName, setRoomName] = useState<string>(""); // State to store room name input
  const [joinRoomIdInput, setJoinRoomIdInput] = useState<string>(""); // State to store input for joining room by ID

  const handleLogin = (token: string) => {
    setAccessToken(token);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setRoomId(null); // Reset room ID on logout
  };

  const createRoom = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/rooms",
        { name: roomName }, // Use the room name from the input field
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const createdRoomId = await response.data.roomId;
      setRoomId(createdRoomId); // Set the room ID in state
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/rooms/${joinRoomIdInput}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const joinedRoomId = await res.data.roomId;
      setRoomId(joinedRoomId);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h1 className="text-3xl font-semibold mb-8">Chat Application</h1>
      {accessToken ? (
        roomId ? (
          <ChatRoom
            accessToken={accessToken}
            onLogout={handleLogout}
            socket={socket}
            roomId={roomId}
          />
        ) : (
          <div>
            <input
              type="text"
              value={roomName}
              placeholder="Enter room name"
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full mb-4 p-2 rounded-md border outline-none focus:border-blue-500"
            />
            <button
              onClick={createRoom}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Create Room
            </button>
          </div>
        )
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      {accessToken && (
        <div>
          <input
            type="text"
            placeholder="Enter room ID to join"
            value={joinRoomIdInput}
            onChange={(e) => setJoinRoomIdInput(e.target.value)}
            className="w-full mb-4 p-2 rounded-md border outline-none focus:border-blue-500"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Join Room
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
