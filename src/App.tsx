
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CredentialsProvider } from "./contexts/CredentialsContext";
import { InstanceProvider } from "./contexts/InstanceContext";
import { AdminProvider } from "./contexts/AdminContext";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import CredentialsPage from "./pages/CredentialsPage";
import DashboardPage from "./pages/DashboardPage";
import InstancePage from "./pages/InstancePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminInstancesPage from "./pages/AdminInstancesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CredentialsProvider>
            <InstanceProvider>
              <AdminProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/credentials" element={<CredentialsPage />} />
                  
                  {/* User Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/instance" element={<InstancePage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/instances" element={<AdminInstancesPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AdminProvider>
            </InstanceProvider>
          </CredentialsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
