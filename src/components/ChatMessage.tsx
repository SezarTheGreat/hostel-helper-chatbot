
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { formatTime } from '@/utils/chatUtils';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { type, text, timestamp, isTyping } = message;
  
  // Function to render the message text with support for basic formatting
  const renderMessageText = (text: string) => {
    // Split text by lines to handle paragraph breaks
    const lines = text.split('\n');
    
    return lines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className={`flex mb-4 ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`px-4 py-3 rounded-lg max-w-[80%] ${
          type === 'user' 
            ? 'bg-chatbot text-white rounded-br-none' 
            : 'bg-muted/50 text-gray-800 rounded-bl-none'
        }`}
      >
        {isTyping ? (
          <div className="flex space-x-1 items-center h-6">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-line">
              {renderMessageText(text)}
            </div>
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
