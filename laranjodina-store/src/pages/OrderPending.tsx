import React from "react";
import { Link } from "react-router-dom";

const OrderPending: React.FC = () => (
  <div className="container order-status-page">
    <div className="order-status-box">
      <div className="order-status-icon pending">⏳</div>
      <h1 className="text-uppercase-black">Pagamento em Análise</h1>
      <p>Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail em breve.</p>
      <Link to="/" className="btn-accent order-status-btn">
        Voltar à Loja
      </Link>
    </div>
  </div>
);

export default OrderPending;
