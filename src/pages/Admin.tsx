
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useStudent } from "@/contexts/StudentContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getComplaints, getEscalations } from "@/services/storageService";
import { Complaint, Escalation } from "@/types";

const Admin = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("escalations");

  useEffect(() => {
    // Redirect if not admin
    if (student && !student.isAdmin) {
      navigate('/dashboard');
    } else if (!student) {
      navigate('/login');
    }
  }, [student, navigate]);

  useEffect(() => {
    // Load complaints and escalations
    const loadData = () => {
      const allComplaints = getComplaints();
      setComplaints(allComplaints);
      
      const allEscalations = getEscalations();
      setEscalations(allEscalations);
    };
    
    loadData();
    
    // Refresh data every minute
    const intervalId = setInterval(loadData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'new':
      case 'pending':
        return "bg-red-500";
      case 'in-progress':
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage hostel and mess complaints</p>
          </div>
        </div>
        
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="escalations">
              Escalations <Badge className="ml-2 bg-red-500">{escalations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all-complaints">
              All Complaints <Badge className="ml-2">{complaints.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="escalations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Escalated Issues</CardTitle>
                <CardDescription>
                  Urgent matters requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {escalations.length > 0 ? (
                  <div className="space-y-4">
                    {escalations.map((escalation) => {
                      const complaint = complaints.find(c => c.id === escalation.complaintId);
                      
                      return (
                        <Card key={escalation.id} className="overflow-hidden">
                          <div className={`h-2 w-full ${getStatusColor(escalation.status)}`}></div>
                          <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row justify-between mb-2">
                              <div>
                                <Badge className="mb-2">{complaint?.category || "Unknown"}</Badge>
                                <h3 className="font-semibold text-lg">
                                  Escalation {escalation.id}
                                </h3>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(escalation.timestamp)}
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-4">
                              {escalation.description}
                            </p>
                            
                            {escalation.suggestedSolution && (
                              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                                <h4 className="font-semibold">AI Suggested Solution:</h4>
                                <p>{escalation.suggestedSolution}</p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <Badge className={getStatusColor(escalation.status)}>
                                {escalation.status.toUpperCase()}
                              </Badge>
                              <Button 
                                onClick={() => navigate(`/admin/escalation/${escalation.id}`)}
                              >
                                Manage Escalation
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No escalations found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all-complaints" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>
                  Complete list of complaints submitted by students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complaints.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/80">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Category</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Escalated</th>
                          <th className="text-center p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complaints.map((complaint) => (
                          <tr key={complaint.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">{complaint.id}</td>
                            <td className="p-2">
                              <Badge variant="outline">{complaint.category}</Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status}
                              </Badge>
                            </td>
                            <td className="p-2">{formatDate(complaint.timestamp)}</td>
                            <td className="p-2 text-center">
                              {complaint.isEscalation ? 
                                <span className="text-red-500">Yes</span> : 
                                <span className="text-gray-500">No</span>
                              }
                            </td>
                            <td className="p-2 text-center">
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/complaint/${complaint.id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No complaints found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
