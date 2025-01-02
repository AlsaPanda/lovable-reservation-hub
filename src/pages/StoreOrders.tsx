import { StoreOrdersTable } from "@/components/store-orders/StoreOrdersTable";
import { useStoreOrders } from "@/hooks/useStoreOrders";

const StoreOrders = () => {
  const { orders, isLoading } = useStoreOrders();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Commandes magasins</h1>
      </div>
      <StoreOrdersTable orders={orders} />
    </div>
  );
};

export default StoreOrders;