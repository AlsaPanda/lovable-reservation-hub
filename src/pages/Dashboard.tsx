import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de charger votre profil"
            });
          } else if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du profil"
        });
      }
    };

    fetchProfile();
  }, [toast]);

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Tableau de bord</h1>
        
        {profile?.role === 'superadmin' && (
          <Card className="mb-6 bg-yellow-50">
            <CardHeader>
              <CardTitle>Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Bienvenue, Super Administrateur</p>
              <div className="space-y-2">
                <p>Statistiques globales :</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Accès à toutes les réservations</li>
                  <li>Gestion des utilisateurs</li>
                  <li>Configuration système</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des produits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Importez et gérez votre catalogue de produits</p>
              <Link to="/products">
                <Button className="w-full">Accéder aux produits</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérez vos réservations et exportez les données</p>
              <Link to="/reservations">
                <Button className="w-full">Accéder aux réservations</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;