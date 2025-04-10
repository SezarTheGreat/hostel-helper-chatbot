
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentProvider } from "./contexts/StudentContext";
import { setupAdminUser } from "./utils/adminUtils";

// Pages
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import FAQs from "./pages/FAQs";
import ComplaintDetail from "./pages/ComplaintDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminEscalationDetail from "./pages/AdminEscalationDetail";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize admin user for demo/hackathon purposes
    setupAdminUser();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StudentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/complaint/:id" element={<ComplaintDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/escalation/:id" element={<AdminEscalationDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StudentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
