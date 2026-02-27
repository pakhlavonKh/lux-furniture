// src/pages/Account/components/OrderCard.tsx
interface Order {
  orderNumber: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
}

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-border p-6 hover:bg-muted/30 transition">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            {order.grandTotal.toLocaleString()} UZS
          </p>
          <p className="text-sm text-muted-foreground">
            {order.orderStatus.replace("_", " ")}
          </p>
        </div>
      </div>
    </div>
  );
}