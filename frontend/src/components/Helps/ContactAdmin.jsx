import React, { useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";
import useUserCurrent from "../../hooks/useUserCurrent";
import axios from "axios";
import Conversation from "../../components/Chat/Conversations";
import { io } from "socket.io-client";
import ChatMessage from "../../components/Chat/ChatMessage";

const ContactAdmin = () => {
  const [newMessage, setNewMessage] = useState("");
  const userData = useUserCurrent();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    const getConversations = async () => {
      try {
        if (userData) {
          const res = await axios.get(
            "http://localhost:3000/api/conversations/" + userData._id
          );
          setConversations(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userData]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get(
            "http://localhost:3000/api/messages/" + currentChat._id
          );
          setMessages(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const socket = io("http://localhost:8800");

    socket.on("connect", () => {
      console.log("Connected to server");
      if (userData) {
        socket.emit("addUser", userData._id);
        socket.on("getUsers", (users) => {
          setOnlineUsers(users);
        });
      }
    });

    socket.on("getMessage", ({ senderId, content }) => {
      setArrivalMessage({
        senderId: senderId,
        content: content,
        createdAt: Date.now(),
      });
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setOnlineUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userData._id)
      );
    });
    return () => {
      socket.disconnect();
    };
  }, [userData]);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      senderId: userData._id,
      content: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== userData._id
    );

    const socket = io("http://localhost:8800");
    socket.emit("sendMessage", {
      senderId: userData._id,
      receiverId: receiverId,
      content: newMessage,
    });
    try {
      await axios.post(
        "http://localhost:3000/api/messages/send-message",
        message
      );
      setMessages([
        ...messages,
        { senderId: userData._id, content: newMessage, createdAt: new Date() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-200 ">
      <div className=" bg-gray-300 p-6 overflow-y-auto">
        {/* Hiển thị danh sách cuộc trò chuyện */}
        {conversations.map((c) => (
          <div onClick={() => setCurrentChat(c)} key={c._id}>
            <Conversation conversation={c} currentUser={userData} />
          </div>
        ))}
      </div>
      <div className="bg-white p-6 flex flex-col md:w-[900px]">
        {/* Hiển thị cuộc trò chuyện hiện tại */}
        <div className="flex-1 overflow-y-auto ">
          {currentChat ? (
            <>
              {messages.map((message, i) => (
                <ChatMessage key={i} message={message} userData={userData} />
              ))}
            </>
          ) : (
            <span>Open a conversation to start a chat.</span>
          )}
        </div>

        <div className="flex mt-4">
          {/* Input để gửi tin nhắn */}
          <InputEmoji
            value={newMessage}
            onChange={setNewMessage}
            placeholder="Nhập nội dung tin nhắn..."
            cleanOnEnter
            className="input"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green hover:bg-green hover:opacity-80 text-white font-bold py-2 px-4 rounded-lg"
          >
            Send
          </button>
        </div>
        <div>
          <h2>Người dùng đang kết nối:</h2>
          <ul>
            {onlineUsers.map((user) => (
              <li
                key={user.userId}
                className={`${user.online ? "text-green-500" : "text-red-500"}`}
              >
                {user.userId} - {user.online ? "Online" : "Offline"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
