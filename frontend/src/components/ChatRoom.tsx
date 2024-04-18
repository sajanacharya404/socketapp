import React, { useState, useEffect } from "react";
import axios from "axios";

interface ChatRoomProps {
  accessToken: string;
  onLogout: () => void;
  socket: SocketIOClient.Socket;
  roomId: string; // Add roomId prop
}
const ChatRoom: React.FC<ChatRoomProps> = ({
  accessToken,
  onLogout,
  socket,
  roomId,
}) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false); // State to track if user has joined the room

  useEffect(() => {
    console.log("Room ID changed:", roomId);
    if (roomId) {
      console.log("Joining room...");
      socket.emit("joinRoom", roomId);
      setJoinedRoom(true);
    }
  }, [roomId, socket]);

  useEffect(() => {
    if (joinedRoom) {
      loadMessageHistory();
    }
  }, [roomId, joinedRoom]); // Load message history whenever roomId changesss

  useEffect(() => {
    socket.on("message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  const loadMessageHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/messages/${roomId}`, // Use roomId in the API URL
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessages(await response.data.map((msg: any) => msg.text));
    } catch (error) {
      console.error("Error fetching message history:", error);
    }
  };

  const handleSendMessage = () => {
    socket.emit("sendMessage", { message, roomId }); // Send message to the current room
    setMessage("");
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Chat Room</h2>
      <div className="overflow-y-auto max-h-80 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 rounded-lg bg-gray-100">
            {msg}
          </div>
        ))}
      </div>
      {joinedRoom && ( // Render input field and send button only if the user has joined the room
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 rounded-md border outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default ChatRoom;
