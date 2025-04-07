
export type MessageType = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface Complaint {
  id: string;
  category: 'hostel' | 'mess' | 'other';
  description: string;
  timestamp: Date;
  status: 'new' | 'in-progress' | 'resolved';
  resolution?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}
