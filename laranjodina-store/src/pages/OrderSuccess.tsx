import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const OrderSuccess: React.FC = () => {
  const [params] = useSearchParams();
  const paymentId = params.get("payment_id");

  return (
    <div className="container order-status-page">
      <div className="order-status-box">
        <div className="order-status-icon success">✅</div>
        <h1 className="text-uppercase-black">Pagamento Confirmado!</h1>
        <p>Seu pedido foi aprovado e está sendo preparado com muito amor. 🧡</p>
        {paymentId && (
          <p className="order-status-id">ID do pagamento: #{paymentId}</p>
        )}
        <Link to="/" className="btn-accent order-status-btn">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
