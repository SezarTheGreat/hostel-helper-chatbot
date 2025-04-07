
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, Complaint, Escalation } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateId } from '@/utils/chatUtils';
import { toast } from '@/components/ui/use-toast';
import { saveComplaint, saveEscalation } from '@/services/storageService';
import { useStudent } from '@/contexts/StudentContext';
import { useNavigate } from 'react-router-dom';
import { processWithGemini } from '@/utils/geminiApi';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<'hostel' | 'mess' | 'other' | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { student } = useStudent();
  const navigate = useNavigate();
  
  // Store chat history for context
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: ChatMessageType = {
      id: generateId(),
      type: 'bot',
      text: student 
        ? `Hello ${student.name}! I'm your Hostel & Mess Assistant. How can I help you today?` 
        : "Hello! I'm your Hostel & Mess Assistant. How can I help you today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [student]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: ChatMessageType) => {
    setMessages(prev => [...prev, message]);
  };

  const createComplaintTicket = (
    category: 'hostel' | 'mess' | 'other',
    description: string,
    isEscalation: boolean = false,
    suggestedSolution?: string
  ): string => {
    const ticketId = `TICKET-${generateId().toUpperCase()}`;
    
    // Create the complaint object
    const complaint: Complaint = {
      id: ticketId,
      category,
      description,
      timestamp: new Date(),
      status: 'new',
      studentId: student?.id,
      isEscalation,
      suggestedSolution
    };
    
    // Save to localStorage
    saveComplaint(complaint);
    
    // Create escalation if needed
    if (isEscalation) {
      const escalation: Escalation = {
        id: `ESCALATION-${generateId().toUpperCase()}`,
        complaintId: ticketId,
        studentId: student?.id || '',
        timestamp: new Date(),
        description: `Escalated issue: ${description}`,
        status: 'pending',
        suggestedSolution
      };
      
      saveEscalation(escalation);
    }
    
    // Update the student's complaints array
    if (student) {
      student.complaints.push(ticketId);
      // This will be updated in the StudentContext
    }
    
    return ticketId;
  };

  const handleSendMessage = async (text: string) => {
    // If not logged in, redirect to login
    if (!student) {
      toast({
        title: "Login Required",
        description: "Please login to chat with the assistant",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
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
    
    // Update chat history
    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: text }
    ];
    setChatHistory(updatedHistory);
    
    // Process the complaint flow or normal message flow
    if (isSubmittingComplaint) {
      if (!complaintCategory) {
        // Attempt to categorize with Gemini
        const geminiResponse = await processWithGemini(text, updatedHistory);
        
        // Set the category from Gemini response or default to 'other'
        const category = geminiResponse.category || 'other';
        setComplaintCategory(category);
        
        setIsTyping(false);
        
        // Ask for complaint details
        const botResponse: ChatMessageType = {
          id: generateId(),
          type: 'bot',
          text: geminiResponse.text || `Got it! I understand this is a ${category} related complaint. Please describe your issue in detail.`,
          timestamp: new Date()
        };
        addMessage(botResponse);
        
        // Update history with bot response
        setChatHistory([
          ...updatedHistory,
          { role: 'assistant', content: botResponse.text }
        ]);
      } else {
        // User has provided complaint details, process with Gemini
        const geminiResponse = await processWithGemini(text, updatedHistory);
        
        // Determine if this needs escalation
        const isEscalation = geminiResponse.isEscalation || false;
        const suggestedSolution = geminiResponse.suggestedSolution;
        
        // Create the ticket with AI-generated info
        const ticketId = createComplaintTicket(complaintCategory, text, isEscalation, suggestedSolution);
        
        setIsTyping(false);
        
        // Add confirmation message
        const escalationText = isEscalation 
          ? " This issue has been marked for urgent attention by administration." 
          : "";
          
        const botResponse: ChatMessageType = {
          id: generateId(),
          type: 'bot',
          text: `Thank you for submitting your complaint. Your ticket number is ${ticketId}.${escalationText} We'll look into this as soon as possible. You can check the status of your complaint in your dashboard.`,
          timestamp: new Date()
        };
        addMessage(botResponse);
        
        // Reset complaint flow
        setIsSubmittingComplaint(false);
        setComplaintCategory(null);
        
        // Update history with bot response
        setChatHistory([
          ...updatedHistory,
          { role: 'assistant', content: botResponse.text }
        ]);
        
        // Show toast notification
        toast({
          title: isEscalation ? "Urgent Complaint Submitted" : "Complaint Submitted",
          description: `Ticket ${ticketId} has been created successfully.`,
          variant: isEscalation ? "destructive" : "default",
        });
      }
    } else {
      // Process regular message with Gemini API
      const geminiResponse = await processWithGemini(text, updatedHistory);
      
      setIsTyping(false);
      
      // Add bot response
      const botResponse: ChatMessageType = {
        id: generateId(),
        type: 'bot',
        text: geminiResponse.text,
        timestamp: new Date()
      };
      addMessage(botResponse);
      
      // Update history with bot response
      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', content: botResponse.text }
      ]);
      
      // If the response identified a complaint intent, start complaint flow
      if (geminiResponse.isComplaint) {
        setIsSubmittingComplaint(true);
        if (geminiResponse.category) {
          setComplaintCategory(geminiResponse.category);
        }
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
              Your AI-powered assistant for hostel and mess related queries
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
          onClick={() => navigate('/dashboard')}
          className="whitespace-nowrap"
        >
          View my complaints
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
