import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Reservations from "./pages/Reservations";
import StoreOrders from "./pages/StoreOrders";
import { supabase } from "./integrations/supabase/client";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <NavBar />
          <main className="container mx-auto px-4 py-8">
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
                  path="/store-orders"
                  element={
                    <PrivateRoute allowedRoles={['superadmin']}>
                      <StoreOrders />
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
                    <PrivateRoute excludedRoles={['superadmin']}>
                      <Reservations />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/products" />} />
              </Routes>
            </BrowserRouter>
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);

export default App;