// src/pages/Account/components/OrdersList.tsx
import OrderCard from "./OrderCard";

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order History</h2>

      {orders.length === 0 ? (
        <div className="border border-border p-8 text-muted-foreground">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}