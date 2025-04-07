
import React from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-chatbot to-accent bg-clip-text text-transparent my-2">
              Hostel & Mess Complaint System
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get instant answers to your questions or submit complaints about hostel facilities and mess services.
            </p>
          </div>
          
          <ChatInterface />
          
          <div className="text-sm text-center text-gray-500 mt-8">
            <p>© 2025 Hostel Helper. All rights reserved.</p>
            <p>A project created for improved hostel management and student welfare.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
