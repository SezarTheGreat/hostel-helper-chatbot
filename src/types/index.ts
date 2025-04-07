
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
  studentId?: string;
  isEscalation?: boolean;
  suggestedSolution?: string;
  adminNotes?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  roomNumber?: string;
  hostelBlock?: string;
  complaints: string[]; // Array of complaint IDs
  isAdmin?: boolean; // Flag to identify admin users
}

export type EscalationStatus = 'pending' | 'acknowledged' | 'in-review' | 'resolved';

export interface Escalation {
  id: string;
  complaintId: string;
  studentId: string;
  timestamp: Date;
  description: string;
  status: EscalationStatus;
  suggestedSolution?: string;
  adminResponse?: string;
}
