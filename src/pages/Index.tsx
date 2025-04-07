
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';
import { isCurrentUserAdmin, getAdminLoginInfo } from '@/utils/adminUtils';

const Index = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  const isAdmin = isCurrentUserAdmin();
  const adminInfo = getAdminLoginInfo();
  
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
            
            {isAdmin && (
              <div className="mt-4">
                <Button 
                  onClick={() => navigate('/admin')}
                  className="bg-accent hover:bg-accent/90"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            )}
            
            {!student && adminInfo && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                <p className="font-medium text-blue-700">Admin Testing Access</p>
                <p className="text-sm text-blue-600 mt-2">
                  For hackathon demo purposes, you can login as admin using:
                </p>
                <p className="text-sm bg-white p-2 rounded mt-2">
                  Email: {adminInfo.email}
                </p>
              </div>
            )}
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

export default Index;
