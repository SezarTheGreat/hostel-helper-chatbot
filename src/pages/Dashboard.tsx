
import { useEffect, useState } from "react";
import { Complaint } from "@/types";
import { getStudentComplaints, updateComplaintStatus } from "@/services/storageService";
import { useStudent } from "@/contexts/StudentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ClipboardList, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { student } = useStudent();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (student) {
      const studentComplaints = getStudentComplaints(student.id);
      setComplaints(studentComplaints);
    }
  }, [student]);

  const handleViewDetails = (complaintId: string) => {
    navigate(`/complaint/${complaintId}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Dashboard</h1>
            <Button 
              onClick={() => navigate('/chat')} 
              className="bg-chatbot hover:bg-chatbot-dark"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with Assistant
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Complaints</CardTitle>
                  <CardDescription>Track the status of your submitted complaints</CardDescription>
                </div>
                <ClipboardList className="h-6 w-6 text-chatbot" />
              </div>
            </CardHeader>
            <CardContent>
              {complaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't submitted any complaints yet</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/chat')} 
                    className="text-chatbot"
                  >
                    Chat with our assistant to submit one
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium capitalize">{complaint.category} Complaint</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                        </div>
                        <Badge className={getStatusBadgeColor(complaint.status)}>
                          {complaint.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-500">Submitted: {formatDate(complaint.timestamp)}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(complaint.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
