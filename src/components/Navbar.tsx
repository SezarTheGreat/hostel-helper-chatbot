
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const { toast } = useToast();
  
  const handleLoginClick = () => {
    toast({
      title: "Authentication Feature",
      description: "User authentication will be implemented in the next version.",
    });
  };
  
  return (
    <header className="border-b bg-white">
      <div className="container flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-chatbot to-accent flex items-center justify-center text-white font-bold">
            H
          </div>
          <h1 className="font-semibold text-lg">Hostel Helper</h1>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLoginClick}
            className="hidden md:inline-flex"
          >
            Login
          </Button>
          <Button 
            size="sm" 
            onClick={handleLoginClick}
            className="bg-chatbot hover:bg-chatbot-dark"
          >
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
