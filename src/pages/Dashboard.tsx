import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Current user email:", user.email);
        console.log("Fetching profile for user:", user.id);
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger votre profil"
          });
          return;
        }

        if (profileData) {
          console.log("Profile loaded:", profileData);
          console.log("User role:", profileData.role);
          setProfile(profileData);
          
          if (profileData.role === 'magasin') {
            console.log("Redirecting magasin user to products");
            navigate("/products");
          }
        } else {
          console.log("No profile found for user");
          // Create new profile logic remains the same
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: user.id,
                store_name: `Store ${user.id.substring(0, 6)}`,
                role: 'magasin'
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de créer votre profil"
            });
            navigate("/login");
          } else {
            console.log("Created new profile:", newProfile);
            setProfile(newProfile);
            if (newProfile.role === 'magasin') {
              navigate("/products");
            }
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
  }, [toast, navigate]);

  // Si l'utilisateur a le rôle 'magasin', il sera redirigé vers /products
  // Cette page ne sera visible que pour les autres rôles
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
