
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";

const Home = () => {
  const { student, isLoading } = useStudent();
  const navigate = useNavigate();

  useEffect(() => {
    // If loading is done, redirect based on login status
    if (!isLoading) {
      if (student) {
        navigate('/dashboard');
      } else {
        navigate('/chat');
      }
    }
  }, [student, isLoading, navigate]);

  // Show a loading state while checking
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-chatbot to-accent mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
          H
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Hostel Helper</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Home;
