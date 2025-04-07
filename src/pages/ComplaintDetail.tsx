
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Complaint } from "@/types";
import { getComplaintById, updateComplaintStatus } from "@/services/storageService";
import { useStudent } from "@/contexts/StudentContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const { student } = useStudent();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const complaintData = getComplaintById(id);
      if (complaintData) {
        setComplaint(complaintData);
      }
    }
  }, [id]);

  const handleMarkResolved = () => {
    if (complaint && id) {
      const updated = updateComplaintStatus(id, 'resolved', 'Resolved by you');
      
      if (updated) {
        setComplaint({ ...complaint, status: 'resolved', resolution: 'Resolved by you' });
        toast({
          title: "Complaint Updated",
          description: "The complaint has been marked as resolved",
        });
      }
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!complaint || !student) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="mb-4">Complaint not found or you're not authorized to view this.</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto space-y-4">
          <Button 
            variant="ghost"
            className="flex items-center gap-1 text-chatbot self-start mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Complaint Details</CardTitle>
                  <p className="text-gray-500 text-sm mt-1">Ticket ID: {complaint.id}</p>
                </div>
                <Badge className={getStatusBadgeColor(complaint.status)}>
                  {complaint.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm text-gray-500">Category</p>
                  <p className="capitalize">{complaint.category}</p>
                </div>
                
                <div>
                  <p className="font-semibold text-sm text-gray-500">Submission Date</p>
                  <p>{formatDate(complaint.timestamp)}</p>
                </div>
                
                <div>
                  <p className="font-semibold text-sm text-gray-500">Description</p>
                  <div className="bg-gray-50 p-4 rounded-md mt-2">
                    <p>{complaint.description}</p>
                  </div>
                </div>
                
                {complaint.resolution && (
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Resolution</p>
                    <div className="bg-gray-50 p-4 rounded-md mt-2">
                      <p>{complaint.resolution}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {complaint.status !== 'resolved' && (
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleMarkResolved}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
