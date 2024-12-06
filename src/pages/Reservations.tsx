import NavBar from "@/components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation } from "@/utils/types";

const Reservations = () => {
  // Ces données seront à terme récupérées depuis une base de données
  const reservations: Reservation[] = [
    {
      reference: "REF001",
      description: "Produit A",
      quantity: 5,
      storeName: "Magasin Paris",
      date: "2024-02-20"
    },
    {
      reference: "REF002",
      description: "Produit B",
      quantity: 3,
      storeName: "Magasin Lyon",
      date: "2024-02-21"
    }
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Réservations</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Liste des réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Magasin</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.reference}>
                    <TableCell>{reservation.reference}</TableCell>
                    <TableCell>{reservation.description}</TableCell>
                    <TableCell>{reservation.quantity}</TableCell>
                    <TableCell>{reservation.storeName}</TableCell>
                    <TableCell>{reservation.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reservations;