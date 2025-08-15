import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import Profile from "../assets/avatar.png";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null)

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessages()

    return () => unsubscribeFromMessages()
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])


  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {/* Messages list */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message?.senderId === authUser?._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="w-10 h-10 rounded-full border overflow-hidden">
                  <img
                    src={
                      isSender
                        ? authUser?.profilePic || Profile
                        : selectedUser?.profilePic || Profile
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* Message bubble */}
              <div className="chat-bubble bg-base-300 text-sm flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="sent"
                    className="mb-2 max-w-xs rounded-lg"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>

              {/* Timestamp */}
              <div className="chat-footer opacity-50 text-xs mt-1">
                {formatMessageTime(message.createdAt)}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
