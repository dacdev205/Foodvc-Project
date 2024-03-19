/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const ChatComponent = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8800");

    // Gửi thông tin người dùng khi kết nối
    socket.current.emit("new-user-add", userId);

    // Lắng nghe tin nhắn mới
    socket.current.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    // Ngắt kết nối khi component unmount
    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = {
        content: newMessage,
        sender: userId,
        // Thêm logic tùy thuộc vào yêu cầu của bạn
      };
      socket.current.emit("send-message", { message });
      setNewMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>{message.content}</p>
            {/* Hiển thị thông tin tin nhắn khác tùy thuộc vào yêu cầu của bạn */}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
