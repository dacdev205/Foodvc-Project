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
      className={`flex ${
        message.senderId === userData ? "justify-end" : "justify-start"
      } mb-2 `}
    >
      <div
        className={`max-w-xs p-2 rounded-lg   ${
          message.senderId === userData
            ? "bg-green text-white"
            : "bg-gray-300 text-black"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs">{format(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
