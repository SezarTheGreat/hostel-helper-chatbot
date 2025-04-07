
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateId, processUserMessage, createComplaintTicket } from '@/utils/chatUtils';
import { toast } from '@/components/ui/use-toast';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<'hostel' | 'mess' | 'other' | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: ChatMessageType = {
      id: generateId(),
      type: 'bot',
      text: "Hello! I'm your Hostel & Mess Assistant. How can I help you today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: ChatMessageType) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      type: 'user',
      text,
      timestamp: new Date()
    };
    addMessage(userMessage);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Process the complaint flow or normal message flow
    if (isSubmittingComplaint) {
      if (!complaintCategory) {
        // Determine complaint category from user message
        let category: 'hostel' | 'mess' | 'other' = 'other';
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('hostel') || lowerText.includes('room') || 
            lowerText.includes('bathroom') || lowerText.includes('facility')) {
          category = 'hostel';
        } else if (lowerText.includes('mess') || lowerText.includes('food') || 
                  lowerText.includes('meal') || lowerText.includes('canteen')) {
          category = 'mess';
        }
        
        setComplaintCategory(category);
        
        // Small delay to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(false);
        
        // Ask for complaint details
        const botResponse: ChatMessageType = {
          id: generateId(),
          type: 'bot',
          text: `Got it! I understand this is a ${category} related complaint. Please describe your issue in detail.`,
          timestamp: new Date()
        };
        addMessage(botResponse);
      } else {
        // User has provided complaint details, process the complaint
        const ticketId = createComplaintTicket(complaintCategory, text);
        
        // Small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTyping(false);
        
        // Add confirmation message
        const botResponse: ChatMessageType = {
          id: generateId(),
          type: 'bot',
          text: `Thank you for submitting your complaint. Your ticket number is ${ticketId}. We'll look into this as soon as possible. You can check the status of your complaint by providing this ticket number.`,
          timestamp: new Date()
        };
        addMessage(botResponse);
        
        // Reset complaint flow
        setIsSubmittingComplaint(false);
        setComplaintCategory(null);
        
        // Show toast notification
        toast({
          title: "Complaint Submitted",
          description: `Ticket ${ticketId} has been created successfully.`,
        });
      }
    } else {
      // Process regular message
      // Small delay to simulate thinking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = processUserMessage(text);
      
      setIsTyping(false);
      
      // Add bot response
      const botResponse: ChatMessageType = {
        id: generateId(),
        type: 'bot',
        text: response.text,
        timestamp: new Date()
      };
      addMessage(botResponse);
      
      // If the response identified a complaint intent, start complaint flow
      if (response.isComplaint) {
        setIsSubmittingComplaint(true);
      }
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewComplaint = () => {
    handleSendMessage("I want to submit a new complaint");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-chatbot to-accent text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-chatbot font-bold">
            H
          </div>
          <div>
            <CardTitle>Hostel Helper</CardTitle>
            <CardDescription className="text-white/80">
              Your assistant for hostel and mess related queries
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[400px] md:h-[500px] overflow-y-auto p-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isTyping && (
            <ChatMessage 
              message={{
                id: 'typing',
                type: 'bot',
                text: '',
                timestamp: new Date(),
                isTyping: true
              }} 
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="bg-muted/50 px-4 py-2 flex gap-2 overflow-x-auto">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => handleQuickQuestion("What are the mess timings?")}
          className="whitespace-nowrap"
        >
          Mess timings
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => handleQuickQuestion("How do I request maintenance?")}
          className="whitespace-nowrap"
        >
          Maintenance help
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleNewComplaint}
          className="whitespace-nowrap"
        >
          New complaint
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => handleQuickQuestion("Check complaint status")}
          className="whitespace-nowrap"
        >
          Status check
        </Button>
      </div>
      
      <CardFooter className="p-0">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isTyping}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
