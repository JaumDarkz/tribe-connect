import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import CheckoutComplete from "./pages/CheckoutComplete";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import EmailLinkHandler from "./pages/auth/EmailLinkHandler";
import ResetPassword from "./pages/auth/ResetPassword";
import BillingSettings from "./pages/dashboard/BillingSettings";
import Settings from "./pages/dashboard/Settings";
import Affiliate from "./pages/dashboard/Affiliate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />

                {/* Public pricing page */}
                <Route path="/pricing" element={<Pricing />} />

                {/* Public authentication routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  }
                />
                <Route path="/auth/email-link" element={<EmailLinkHandler />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />

                {/* Checkout flow routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/success"
                  element={
                    <ProtectedRoute>
                      <CheckoutComplete />
                    </ProtectedRoute>
                  }
                />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/billing"
                  element={
                    <ProtectedRoute>
                      <BillingSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/affiliate"
                  element={
                    <ProtectedRoute>
                      <Affiliate />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
