import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Tableau de bord</h1>
      
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
  );
};

export default Dashboard;