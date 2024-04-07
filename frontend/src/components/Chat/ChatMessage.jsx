/* eslint-disable react/prop-types */
// ChatMessage.js
import React, { useEffect, useRef } from "react";
import { format } from "timeago.js";

const ChatMessage = ({ message, userData }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        justifyContent:
          message.senderId === userData?._id ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          background:
            message.senderId === userData?._id ? "#DCF8C6" : "#E5E7EB",
          padding: "8px 12px",
          borderRadius: "12px",
          marginBottom: "8px",
        }}
      >
        <p className="text-black">{message.content}</p>
        <span className="text-sm">{format(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
