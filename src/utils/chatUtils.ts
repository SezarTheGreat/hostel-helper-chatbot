
import { ChatMessage, FAQ } from "@/types";
import { faqs } from "@/data/faqs";

// Generate a unique ID for messages and tickets
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Find FAQs that match the user's query
export const findMatchingFAQ = (query: string): FAQ | null => {
  const lowercaseQuery = query.toLowerCase();
  
  // First try exact question match
  const exactMatch = faqs.find(
    (faq) => faq.question.toLowerCase() === lowercaseQuery
  );
  if (exactMatch) return exactMatch;
  
  // Then try keyword matching
  const matchingFAQ = faqs.find((faq) => 
    faq.keywords.some(keyword => 
      lowercaseQuery.includes(keyword.toLowerCase())
    )
  );
  
  return matchingFAQ || null;
};

// Process user message and generate bot response
export const processUserMessage = (
  message: string
): { text: string; isComplaint: boolean } => {
  const lowercaseMessage = message.toLowerCase();
  
  // Check if it's a greeting
  if (/\b(hi|hello|hey|greetings)\b/.test(lowercaseMessage)) {
    return {
      text: "Hi there! I'm your Hostel & Mess Assistant. How can I help you today? You can ask about facilities, submit a complaint, or check complaint status.",
      isComplaint: false
    };
  }
  
  // Check if user wants to submit a complaint
  if (/\b(complaint|complain|issue|problem|broken|not working|bad)\b/.test(lowercaseMessage)) {
    return {
      text: "I understand you want to submit a complaint. Please tell me if it's related to hostel facilities, mess food, or something else. Then describe your issue in detail.",
      isComplaint: true
    };
  }
  
  // Check for complaint status query
  if (/\b(status|track|ticket|complaint id)\b/.test(lowercaseMessage)) {
    return {
      text: "To check your complaint status, please provide your ticket number. If you don't have one, you can view all your complaints from the dashboard.",
      isComplaint: false
    };
  }
  
  // Check for FAQ matches
  const matchingFAQ = findMatchingFAQ(message);
  if (matchingFAQ) {
    return {
      text: matchingFAQ.answer,
      isComplaint: false
    };
  }
  
  // Default response
  return {
    text: "I'm not sure I understand that. Could you rephrase your question? Or if you'd like to submit a complaint, just type 'new complaint'.",
    isComplaint: false
  };
};

// Create a new complaint ticket
export const createComplaintTicket = (
  category: 'hostel' | 'mess' | 'other',
  description: string
): string => {
  const ticketId = `TICKET-${generateId().toUpperCase()}`;
  // In a real app, we would save this to a database
  return ticketId;
};

// Format timestamp for display
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
