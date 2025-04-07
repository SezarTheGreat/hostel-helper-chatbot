
import { Complaint, Student, Escalation } from "@/types";

// Keys for localStorage
const STUDENTS_KEY = 'hostel_helper_students';
const COMPLAINTS_KEY = 'hostel_helper_complaints';
const CURRENT_STUDENT_KEY = 'hostel_helper_current_student';
const ESCALATIONS_KEY = 'hostel_helper_escalations';

// Student methods
export const getStudents = (): Student[] => {
  const studentsJson = localStorage.getItem(STUDENTS_KEY);
  return studentsJson ? JSON.parse(studentsJson) : [];
};

export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getStudentById = (id: string): Student | undefined => {
  const students = getStudents();
  return students.find(student => student.id === id);
};

export const saveStudent = (student: Student): void => {
  const students = getStudents();
  const existingIndex = students.findIndex(s => s.id === student.id);
  
  if (existingIndex !== -1) {
    students[existingIndex] = student;
  } else {
    students.push(student);
  }
  
  saveStudents(students);
};

export const getCurrentStudent = (): Student | null => {
  const currentStudentJson = localStorage.getItem(CURRENT_STUDENT_KEY);
  return currentStudentJson ? JSON.parse(currentStudentJson) : null;
};

export const setCurrentStudent = (student: Student | null): void => {
  if (student) {
    localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
  } else {
    localStorage.removeItem(CURRENT_STUDENT_KEY);
  }
};

// Complaint methods
export const getComplaints = (): Complaint[] => {
  const complaintsJson = localStorage.getItem(COMPLAINTS_KEY);
  const complaints = complaintsJson ? JSON.parse(complaintsJson) : [];
  
  // Convert string timestamps back to Date objects
  return complaints.map((complaint: any) => ({
    ...complaint,
    timestamp: new Date(complaint.timestamp)
  }));
};

export const saveComplaints = (complaints: Complaint[]): void => {
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
};

export const getComplaintById = (id: string): Complaint | undefined => {
  const complaints = getComplaints();
  return complaints.find(complaint => complaint.id === id);
};

export const saveComplaint = (complaint: Complaint): void => {
  const complaints = getComplaints();
  const existingIndex = complaints.findIndex(c => c.id === complaint.id);
  
  if (existingIndex !== -1) {
    complaints[existingIndex] = complaint;
  } else {
    complaints.push(complaint);
  }
  
  saveComplaints(complaints);
};

export const getStudentComplaints = (studentId: string): Complaint[] => {
  const complaints = getComplaints();
  return complaints.filter(complaint => complaint.studentId === studentId);
};

export const updateComplaintStatus = (
  complaintId: string, 
  status: 'new' | 'in-progress' | 'resolved', 
  resolution?: string
): boolean => {
  const complaints = getComplaints();
  const complaintIndex = complaints.findIndex(c => c.id === complaintId);
  
  if (complaintIndex !== -1) {
    complaints[complaintIndex].status = status;
    if (resolution) {
      complaints[complaintIndex].resolution = resolution;
    }
    saveComplaints(complaints);
    return true;
  }
  
  return false;
};

// New Escalation methods
export const getEscalations = (): Escalation[] => {
  const escalationsJson = localStorage.getItem(ESCALATIONS_KEY);
  const escalations = escalationsJson ? JSON.parse(escalationsJson) : [];
  
  // Convert string timestamps back to Date objects
  return escalations.map((escalation: any) => ({
    ...escalation,
    timestamp: new Date(escalation.timestamp)
  }));
};

export const saveEscalations = (escalations: Escalation[]): void => {
  localStorage.setItem(ESCALATIONS_KEY, JSON.stringify(escalations));
};

export const saveEscalation = (escalation: Escalation): void => {
  const escalations = getEscalations();
  const existingIndex = escalations.findIndex(e => e.id === escalation.id);
  
  if (existingIndex !== -1) {
    escalations[existingIndex] = escalation;
  } else {
    escalations.push(escalation);
  }
  
  saveEscalations(escalations);
};

export const getEscalationsByComplaintId = (complaintId: string): Escalation[] => {
  const escalations = getEscalations();
  return escalations.filter(escalation => escalation.complaintId === complaintId);
};

export const updateEscalationStatus = (
  escalationId: string,
  status: 'pending' | 'acknowledged' | 'in-review' | 'resolved',
  adminResponse?: string
): boolean => {
  const escalations = getEscalations();
  const escalationIndex = escalations.findIndex(e => e.id === escalationId);
  
  if (escalationIndex !== -1) {
    escalations[escalationIndex].status = status;
    if (adminResponse) {
      escalations[escalationIndex].adminResponse = adminResponse;
    }
    saveEscalations(escalations);
    return true;
  }
  
  return false;
};

// Admin methods
export const createAdminUser = (): Student => {
  const students = getStudents();
  
  // Check if admin already exists
  const existingAdmin = students.find(s => s.isAdmin);
  
  if (existingAdmin) {
    return existingAdmin;
  }
  
  // Create a new admin user
  const adminUser: Student = {
    id: 'admin-' + Date.now().toString(),
    name: 'Admin User',
    email: 'admin@hostelhelper.com',
    complaints: [],
    isAdmin: true
  };
  
  students.push(adminUser);
  saveStudents(students);
  
  return adminUser;
};

// Initialize an admin user if none exists
export const initializeAdmin = (): void => {
  createAdminUser();
};
