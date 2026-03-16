// src/pages/Account/components/OrdersList.tsx
import { useLanguage } from "@/contexts/useLanguageHook";
import "../account.css";

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  const { t } = useLanguage();

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'order-status-completed';
      case 'pending':
        return 'order-status-pending';
      case 'cancelled':
        return 'order-status-cancelled';
      case 'processing':
        return 'order-status-processing';
      default:
        return 'order-status-pending';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return t("account.completed");
      case 'pending':
        return t("account.pending");
      case 'cancelled':
        return t("account.cancelled");
      case 'processing':
        return t("account.processing");
      default:
        return status;
    }
  };

  return (
    <div className="orders-section">
      <div className="orders-header">
        <h2 className="orders-title">{t("account.orderHistory")}</h2>
        <p className="orders-subtitle">{t("account.trackOrders")}</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">
            <svg className="orders-empty-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
            </svg>
          </div>
          <p className="orders-empty-title">{t("account.noOrders")}</p>
          <p className="orders-empty-description">{t("account.noOrdersDescription")}</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order._id} className="order-card">
              <div className="order-card-content">
                {/* Left Section */}
                <div className="order-card-left">
                  <div className="order-card-header">
                    <span className="order-card-label">{t("account.order")}</span>
                    <p className="order-card-number">#{String(index + 1).padStart(4, '0')}</p>
                  </div>
                  <div className="order-card-details">
                    <p className="order-card-id">{order.orderNumber}</p>
                    <p className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="order-card-right">
                  <span className={`order-status-badge ${getStatusClass(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                  <p className="order-card-price">
                    {order.grandTotal.toLocaleString()} UZS
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}