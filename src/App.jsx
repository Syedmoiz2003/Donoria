import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HospitalRegister from "./pages/HospitalRegister";
import AdminRegister from "./pages/AdminRegister";
import RegisterSelect from "./pages/RegisterSelect";
import DonorDashboard from "./pages/donor/DonorDashboard";
import HealthChatbot from "./pages/donor/HealthChatbot";

import RequestDetails from "./pages/donor/RequestDetails";
import SubmitResponse from "./pages/donor/SubmitResponse";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalRequestDetails from "./pages/hospital/HospitalRequestDetails";
import HospitalResponses from "./pages/hospital/HospitalResponses";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmergencyButton from "./pages/EmergencyButton";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Missing Static & Auth Pages
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Hospital Sub-Feature Pages
import PostRequest from "./pages/hospital/PostRequest";
import HospitalRequests from "./pages/hospital/HospitalRequests";
import EditRequest from "./pages/hospital/EditRequest";
import HospitalInventory from "./pages/hospital/HospitalInventory";
import HospitalReports from "./pages/hospital/HospitalReports";
import HospitalSettings from "./pages/hospital/HospitalSettings";

// Admin Sub-Feature Pages
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVerify from "./pages/admin/AdminVerify";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminFeedback from "./pages/admin/AdminFeedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/role-select" element={<RoleSelect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/hospital/login" element={<Login />} />
              <Route path="/register" element={<RegisterSelect />} />
              <Route path="/register/donor" element={<Register />} />
              <Route path="/register/hospital" element={<HospitalRegister />} />
              <Route path="/hospital-register" element={<HospitalRegister />} />
              <Route path="/register/admin" element={<AdminRegister />} />
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              <Route path="/donor/chatbot" element={<HealthChatbot />} />

              <Route path="/donor/request/:id" element={<RequestDetails />} />
              <Route path="/donor/request/:id/respond" element={<SubmitResponse />} />
              
              {/* Hospital Sub-Routes */}
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
              <Route path="/hospital/post-request" element={<PostRequest />} />
              <Route path="/hospital/requests" element={<HospitalRequests />} />
              <Route path="/hospital/request/:id" element={<HospitalRequestDetails />} />
              <Route path="/hospital/request/:id/edit" element={<EditRequest />} />
              <Route path="/hospital/request/:id/responses" element={<HospitalRequestDetails />} />
              <Route path="/hospital/responses" element={<HospitalResponses />} />
              <Route path="/hospital/inventory" element={<HospitalInventory />} />
              <Route path="/hospital/reports" element={<HospitalReports />} />
              <Route path="/hospital/settings" element={<HospitalSettings />} />
              
              {/* Admin Sub-Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/verify" element={<AdminVerify />} />
              <Route path="/admin/verify/:id" element={<AdminVerify />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/feedback" element={<AdminFeedback />} />

              <Route path="/emergency" element={<EmergencyButton />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/donor/profile" element={<Profile />} />
              <Route path="/donor/settings" element={<Settings />} />
              <Route path="/logout" element={<Login />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
