
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student } from "@/types";
import { getCurrentStudent, setCurrentStudent, saveStudent } from "@/services/storageService";
import { generateId } from "@/utils/chatUtils";

interface StudentContextType {
  student: Student | null;
  isLoading: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<Student>) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load current student from localStorage on mount
    const loadedStudent = getCurrentStudent();
    setStudent(loadedStudent);
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    const newStudent: Student = {
      id: generateId(),
      name,
      email,
      complaints: []
    };
    
    saveStudent(newStudent);
    setCurrentStudent(newStudent);
    setStudent(newStudent);
  };

  const logout = () => {
    setCurrentStudent(null);
    setStudent(null);
  };

  const updateProfile = (data: Partial<Student>) => {
    if (!student) return;
    
    const updatedStudent = { ...student, ...data };
    saveStudent(updatedStudent);
    setCurrentStudent(updatedStudent);
    setStudent(updatedStudent);
  };

  return (
    <StudentContext.Provider value={{ student, isLoading, login, logout, updateProfile }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
