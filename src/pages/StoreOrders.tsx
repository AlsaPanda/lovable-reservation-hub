import { StoreOrdersTable } from "@/components/store-orders/StoreOrdersTable";
import { useStoreOrders } from "@/hooks/useStoreOrders";
import { useToast } from "@/hooks/use-toast";

const StoreOrders = () => {
  const { storeOrders } = useStoreOrders();
  const { toast } = useToast();

  const handleViewDetails = (storeName: string) => {
    // For now, just show a toast when viewing details
    toast({
      title: "Détails du magasin",
      description: `Affichage des détails pour ${storeName}`
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Commandes magasins</h1>
      </div>
      <StoreOrdersTable 
        storeOrders={storeOrders} 
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default StoreOrders;