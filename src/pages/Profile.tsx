
import { useState } from "react";
import { useStudent } from "@/contexts/StudentContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const { student, updateProfile, logout } = useStudent();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [roomNumber, setRoomNumber] = useState(student?.roomNumber || "");
  const [hostelBlock, setHostelBlock] = useState(student?.hostelBlock || "");
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }
    
    updateProfile({
      name,
      email,
      roomNumber: roomNumber || undefined,
      hostelBlock: hostelBlock || undefined
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully"
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    navigate('/login');
  };
  
  if (!student) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g., A-201"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hostelBlock">Hostel Block</Label>
                  <Input
                    id="hostelBlock"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    placeholder="e.g., North Block"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
                <Button type="submit" className="bg-chatbot hover:bg-chatbot-dark">
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
