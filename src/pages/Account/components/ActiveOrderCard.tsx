interface Order {
  orderNumber: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  created: "bg-gray-200 text-gray-800",
  confirmed: "bg-blue-200 text-blue-800",
  in_production: "bg-purple-200 text-purple-800",
  shipped: "bg-cyan-200 text-cyan-800",
};

export default function ActiveOrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border/50 p-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          Active Order — {order.orderNumber}
        </h2>
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            statusColors[order.orderStatus] || "bg-gray-200"
          }`}
        >
          {order.orderStatus.replace("_", " ")}
        </span>
      </div>

      <p className="text-muted-foreground mb-2">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <p className="font-semibold">
        {order.grandTotal.toLocaleString()} UZS
      </p>
    </div>
  );
}