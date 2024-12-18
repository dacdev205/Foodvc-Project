import React, { useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";
import useUserCurrent from "../../hooks/useUserCurrent";
import axios from "axios";
import Conversation from "../../components/Chat/Conversations";
import { io } from "socket.io-client";
import ChatMessage from "../../components/Chat/ChatMessage";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import userAPI from "../../api/userAPI";
import shopAPI from "../../api/shopAPI";
import { toast } from "react-toastify";

const ContactAdmin = () => {
  const [newMessage, setNewMessage] = useState("");
  const userData = useUserCurrent();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const token = localStorage.getItem("access-token");
  useEffect(() => {
    const getConversations = async () => {
      try {
        if (userData) {
          const res = await axios.get(
            "http://localhost:3000/api/conversations/" + userData._id,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          setConversations(res.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [userData, token]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      try {
        if (currentChat) {
          const res = await axios.get(
            "http://localhost:3000/api/messages/" + currentChat._id,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          setMessages(res.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [currentChat, token]);

  useEffect(() => {
    const socket = io("http://localhost:8800");

    socket.on("connect", () => {
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
      setOnlineUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userData._id)
      );
    });

    return () => {
      socket.emit("removeUser", userData?._id);
      socket.disconnect();
    };
  }, [userData]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  useEffect(() => {
    const fetchPartnerName = async () => {
      if (currentChat) {
        const partnerId = currentChat.members.find(
          (member) => member !== userData?._id
        );
        try {
          const resShop = await shopAPI.getShop(partnerId);
          setPartnerName(resShop?.shop?.shopName || "Unknown Shop");
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchPartnerName();
  }, [currentChat, userData]);
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!currentChat) {
      toast.error("Vui lòng chọn một cuộc trò chuyện trước khi gửi tin nhắn.");
      return;
    }
    if (!newMessage.trim()) {
      toast.error("Tin nhắn không được để trống.");
      return;
    }

    const message = {
      senderId: userData._id,
      content: newMessage,
      conversationsId: currentChat._id,
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
        message,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [
        ...prev,
        { senderId: userData._id, content: newMessage, createdAt: new Date() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi gửi tin nhắn.");
    }
  };

  return (
    <div className="flex h-full">
      <div className="bg-gray-200 p-4 rounded-lg overflow-y-auto flex-1">
        {loadingConversations ? (
          <div className="flex justify-center items-center">
            <CircularProgress color="success" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">Chưa có cuộc trò chuyện nào.</p>
        ) : (
          conversations.map((c) => {
            const membersWithStatus = c.members.map((member) => ({
              memberId: member,
              isOnline: onlineUsers.some((user) => user.userId === member),
            }));
            return (
              <div onClick={() => setCurrentChat(c)} key={c._id}>
                <Conversation
                  conversation={c}
                  currentUser={userData}
                  membersWithStatus={membersWithStatus}
                />
              </div>
            );
          })
        )}
      </div>
      <div className="bg-white flex flex-col border-gray-300">
        <nav className="p-4 bg-gray-100 border-b">
          <h2 className="text-md">
            {currentChat ? (
              <>
                Đang trò chuyện với: <strong>{partnerName}</strong>
              </>
            ) : (
              "Mở cuộc trò chuyện để bắt đầu chat."
            )}
          </h2>
        </nav>
        <div className="flex-1 overflow-y-auto w-96 p-3 mt-3 scrollbar-thin scrollbar-webkit">
          {loadingMessages ? (
            <div className="flex justify-center items-center">
              <CircularProgress color="success" />
            </div>
          ) : currentChat ? (
            messages.length > 0 ? (
              messages.map((message, i) => (
                <ChatMessage
                  key={i}
                  message={message}
                  userData={userData?._id}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center mx-auto">
                Chưa có tin nhắn nào.
              </p>
            )
          ) : (
            ""
          )}
        </div>
        <div className="flex mt-4">
          <InputEmoji
            value={newMessage}
            onChange={setNewMessage}
            placeholder="Nhập nội dung tin nhắn..."
            cleanOnEnter
            className="input flex-1 border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green hover:bg-green text-white font-bold py-2 px-4 rounded-lg ml-2"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
