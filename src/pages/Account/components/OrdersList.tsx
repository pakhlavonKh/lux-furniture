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
    <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-12">

      <h2 className="heading-card mb-10">
        Order History
      </h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-body">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex justify-between items-center border-b border-border pb-4"
            >
              <div>
                <p className="font-medium">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="font-medium">
                {order.grandTotal.toLocaleString()} UZS
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}