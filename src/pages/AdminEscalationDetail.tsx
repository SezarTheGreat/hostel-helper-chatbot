
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useStudent } from "@/contexts/StudentContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  getEscalations, 
  updateEscalationStatus, 
  getComplaintById,
  getStudentById, 
  updateComplaintStatus
} from "@/services/storageService";
import { Escalation, EscalationStatus, Complaint } from "@/types";

const AdminEscalationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student } = useStudent();
  
  const [escalation, setEscalation] = useState<Escalation | null>(null);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not admin
    if (student && !student.isAdmin) {
      navigate('/dashboard');
    } else if (!student) {
      navigate('/login');
    }
  }, [student, navigate]);
  
  useEffect(() => {
    const loadEscalation = () => {
      if (id) {
        const allEscalations = getEscalations();
        const foundEscalation = allEscalations.find(e => e.id === id);
        
        if (foundEscalation) {
          setEscalation(foundEscalation);
          setAdminResponse(foundEscalation.adminResponse || "");
          
          // Load related complaint
          const foundComplaint = getComplaintById(foundEscalation.complaintId);
          if (foundComplaint) {
            setComplaint(foundComplaint);
          }
        }
      }
      setLoading(false);
    };
    
    loadEscalation();
  }, [id]);
  
  const updateStatus = (status: EscalationStatus) => {
    if (!escalation || !id) return;
    
    const success = updateEscalationStatus(id, status, adminResponse);
    
    if (success) {
      // Also update the complaint status
      if (complaint) {
        let complaintStatus: 'new' | 'in-progress' | 'resolved';
        
        switch (status) {
          case 'acknowledged':
          case 'in-review':
            complaintStatus = 'in-progress';
            break;
          case 'resolved':
            complaintStatus = 'resolved';
            break;
          default:
            complaintStatus = 'new';
        }
        
        updateComplaintStatus(complaint.id, complaintStatus, adminResponse);
      }
      
      // Update local state
      setEscalation({
        ...escalation,
        status,
        adminResponse
      });
      
      toast({
        title: "Escalation updated",
        description: `Status changed to ${status}`,
      });
    } else {
      toast({
        title: "Update failed",
        description: "Could not update escalation status",
        variant: "destructive"
      });
    }
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return "bg-red-500";
      case 'acknowledged':
      case 'in-review':
        return "bg-yellow-500";
      case 'resolved':
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-4 flex items-center justify-center flex-1">
          <p>Loading escalation details...</p>
        </div>
      </div>
    );
  }
  
  if (!escalation) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-4 flex flex-col items-center justify-center flex-1">
          <h2 className="text-xl font-semibold mb-4">Escalation not found</h2>
          <Button onClick={() => navigate('/admin')}>
            Back to Admin Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const studentDetails = getStudentById(escalation.studentId);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            Back to Admin Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold">Escalation Details</h1>
          <p className="text-gray-600">Review and manage escalated issue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardHeader className="relative">
                <div className={`absolute top-0 left-0 w-full h-2 ${getStatusColor(escalation.status)}`}></div>
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {escalation.id}
                    </CardTitle>
                    <Badge className={getStatusColor(escalation.status)}>
                      {escalation.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Description</h3>
                    <p>{escalation.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Submitted</h3>
                    <p>{formatDate(escalation.timestamp)}</p>
                  </div>
                  
                  {complaint && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Related Complaint</h3>
                      <p>
                        {complaint.id} - {complaint.category} - 
                        <Badge className="ml-2 capitalize">{complaint.status}</Badge>
                      </p>
                      <p className="mt-2">{complaint.description}</p>
                    </div>
                  )}
                  
                  {escalation.suggestedSolution && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                      <h3 className="font-semibold text-gray-700">AI Suggested Solution</h3>
                      <p>{escalation.suggestedSolution}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Admin Response</CardTitle>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  placeholder="Write your response or notes about this escalation..."
                  className="min-h-[150px]"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                />
              </CardContent>
              
              <CardFooter className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateStatus('acknowledged')}
                  disabled={escalation.status === 'acknowledged'}
                  variant={escalation.status === 'acknowledged' ? "outline" : "default"}
                >
                  Acknowledge
                </Button>
                
                <Button
                  onClick={() => updateStatus('in-review')}
                  disabled={escalation.status === 'in-review'}
                  variant={escalation.status === 'in-review' ? "outline" : "default"}
                >
                  Mark In-Review
                </Button>
                
                <Button
                  onClick={() => updateStatus('resolved')}
                  disabled={escalation.status === 'resolved'}
                  variant={escalation.status === 'resolved' ? "outline" : "default"}
                  className={escalation.status === 'resolved' ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  Mark Resolved
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              
              <CardContent>
                {studentDetails ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Name</h3>
                      <p>{studentDetails.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700">Email</h3>
                      <p>{studentDetails.email}</p>
                    </div>
                    
                    {studentDetails.roomNumber && (
                      <div>
                        <h3 className="font-semibold text-gray-700">Room</h3>
                        <p>{studentDetails.roomNumber}</p>
                      </div>
                    )}
                    
                    {studentDetails.hostelBlock && (
                      <div>
                        <h3 className="font-semibold text-gray-700">Hostel Block</h3>
                        <p>{studentDetails.hostelBlock}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-gray-700">Total Complaints</h3>
                      <p>{studentDetails.complaints.length}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Student information not found</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {complaint && (
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/complaint/${complaint.id}`)}
                    >
                      View Full Complaint
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    Print Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEscalationDetail;
