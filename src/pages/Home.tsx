
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const Home = () => {
  const { student, isLoading } = useStudent();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Handle progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // After loading animation completes, redirect based on login status
    if (progress === 100) {
      const redirectTimer = setTimeout(() => {
        if (!isLoading) {
          if (student) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        }
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [student, isLoading, navigate, progress]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md mx-auto p-6 animate-fade-in">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6">
            <img 
              src="/lovable-uploads/5fd48585-5a80-44a2-a7c5-c353d4a9878d.png" 
              alt="Cxeasrs Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hostel Helper</h1>
          <p className="text-gray-600 mb-2">Your hostel assistance companion</p>
          <p className="text-blue-800 font-semibold mb-8">by Team Cxeasrs</p>
          
          <div className="relative mb-8">
            <Progress value={progress} className="h-2 w-full bg-gray-200" />
            <div className="mt-4 flex items-center justify-center text-gray-500">
              <Loader className="animate-spin mr-2" size={18} />
              <span>Loading your experience...</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Helping students resolve hostel and mess issues since 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
