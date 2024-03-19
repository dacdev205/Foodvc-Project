import React, { useEffect, useState, useRef } from "react";
import useMessage2Admin from "../hooks/useMessage2Admin";
import singleAPI from "../api/userAPI";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import io from "socket.io-client";
import useAdminData from "../hooks/useAdminData";
import messageAPI from "../api/messagesAPI";

const ContactAdmin = () => {
  const [messages, refetch] = useMessage2Admin();
  const [users, setUsers] = useState([]);
  const [chatId, setChatId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineAdmins, setOnlineAdmins] = useState([]);
  const [messagesContent, setMessages] = useState([]);
  const socket = useRef(null);
  const userData = useAdminData();

  useEffect(() => {
    if (selectedUser) {
      socket.current = io("http://localhost:8800");
      socket.current.emit("new-user-add", selectedUser._id);
      socket.current.emit("new-user-add", userData._id);

      socket.current.on("get-users", (users) => {
        // Lọc ra các kết nối có vai trò là admin
        const admins = users.filter((user) => user.role === "admin");
        setOnlineAdmins(admins);
      });
      socket.current.on("connect", () => {
        console.log("Connected to server");
      });
      socket.current.on("recieve-message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });
    }
  }, [selectedUser, userData]);

  // fetch messages
  useEffect(() => {
    const userId = userData && userData._id;

    const fetchAllUsers = async () => {
      try {
        const uniqueSenderIds = [
          ...new Set(messages.map((message) => message.sender)),
        ];
        const usersData = await Promise.all(
          uniqueSenderIds.map(async (senderId) => {
            const result = await singleAPI.getSingleUserById(senderId);
            return result;
          })
        );
        const filteredUsers = usersData.filter(
          (user) => user && user._id !== userId
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (messages.length > 0 && userId) {
      fetchAllUsers();
    }
  }, [messages, userData]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    const userMessage = messages.find((message) => message.sender === user._id);
    const clickedChatId = userMessage?.chatId;
    setChatId(clickedChatId);
  };

  useEffect(() => {
    if (chatId) {
      try {
        const fetchData = async () => {
          const data = await messageAPI.getChatWithId(chatId);
          setMessages(data);
        };
        fetchData();
      } catch (error) {
        console.log("Error:", error);
      }
    }
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (userData) {
      const message = {
        sender: userData._id,
        content: newMessage,
        receivers: selectedUser._id,
        chatId: chatId,
      };
      socket.current.emit("send-message", {
        receiverId: selectedUser._id,
        message: message,
      });
      await messageAPI.addMessage(message);
      setNewMessage("");
    }
  };
  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };
  return (
    <div className="flex h-screen bg-gray-200">
      <div className=" bg-gray-300 p-6 overflow-y-auto">
        {users.map((user, i) => (
          <div
            key={i}
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-400 mr-4"></div>
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="text-gray-600">Online</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 flex flex-col md:w-[900px]">
        <div className="flex-1 overflow-y-auto ">
          {messagesContent.map((message, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  message.sender === userData?._id ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background:
                    message.sender === userData?._id ? "#DCF8C6" : "#E5E7EB",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  marginBottom: "8px",
                }}
              >
                <p className="text-black">{message.content}</p>
                <span className="text-sm">{format(message.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <InputEmoji
            value={newMessage}
            onChange={handleChange}
            placeholder="Nhập nội dung tin nhắn..."
            className="input"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green hover:bg-green hover:opacity-80 text-white font-bold py-2 px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
