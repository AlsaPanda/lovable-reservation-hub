import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First clear any existing session
      localStorage.removeItem('sb-' + supabase.projectId + '-auth-token');
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      console.log("User logged out successfully");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });

      // Force a hard redirect to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      // In case of any error, still try to redirect to login
      navigate('/login');
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  );
};

export default LogoutButton;