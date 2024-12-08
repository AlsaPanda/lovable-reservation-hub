import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Reservations from "./pages/Reservations";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const session = useSession();
  console.log("Session state:", session);
  
  const checkUserRole = async () => {
    if (!session?.user?.id) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    return data?.role;
  };
  
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    if (session?.user?.id) {
      checkUserRole().then(role => {
        setUserRole(role);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [session]);
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!session) {
    console.log("No session, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    console.log("User role not authorized:", userRole);
    return <Navigate to="/products" />;
  }
  
  console.log("Session found, rendering protected content");
  return <>{children}</>;
};

const App = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['superadmin', 'admin']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <PrivateRoute>
                  <Reservations />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);

export default App;