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
      setRoomId(response.data.roomId);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      await axios.post(
        `http://localhost:3001/api/rooms/${roomId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRoomId(roomId);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div>
      <h1>Chat Application</h1>
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
            />
            <button onClick={createRoom}>Create Room</button>
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
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={() => joinRoom(roomId || "")}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default App;
