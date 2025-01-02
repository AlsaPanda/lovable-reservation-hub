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
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        // If there's a session error, we can assume the user is already logged out
        navigate('/login');
        return;
      }

      if (!session) {
        console.log("No active session found, redirecting to login");
        navigate('/login');
        return;
      }

      // If we have a valid session, proceed with logout
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        if (error.message.includes('session_not_found')) {
          // If session not found, just redirect to login
          navigate('/login');
          return;
        }
        throw error;
      }
      
      console.log("User logged out successfully");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      // In case of any error, redirect to login anyway
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