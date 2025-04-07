
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { formatTime } from '@/utils/chatUtils';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { type, text, timestamp, isTyping } = message;
  
  return (
    <div className={`flex mb-4 ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
        {isTyping ? (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        ) : (
          <>
            <p>{text}</p>
            <span className="text-xs opacity-75 block mt-1 text-right">
              {formatTime(timestamp)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
