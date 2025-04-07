
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useStudent } from '@/contexts/StudentContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { toast } = useToast();
  const { student, logout } = useStudent();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="border-b bg-white">
      <div className="container flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-chatbot to-accent flex items-center justify-center text-white font-bold">
              H
            </div>
            <h1 className="font-semibold text-lg">Hostel Helper</h1>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/chat" className="text-gray-600 hover:text-chatbot">Chat</Link>
          <Link to="/faqs" className="text-gray-600 hover:text-chatbot">FAQs</Link>
          {student && (
            <Link to="/dashboard" className="text-gray-600 hover:text-chatbot">Dashboard</Link>
          )}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {student ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/profile')}
                className="text-chatbot"
              >
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/chat" 
              className="px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chat
            </Link>
            <Link 
              to="/faqs" 
              className="px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQs
            </Link>
            {student && (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="mt-2"
                >
                  Log out
                </Button>
              </>
            )}
            {!student && (
              <Button 
                size="sm" 
                onClick={handleLoginClick}
                className="bg-chatbot hover:bg-chatbot-dark mt-2"
              >
                Login / Sign Up
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
