// src/components/OrderSummary.tsx

import React from 'react';
import { CartItem } from './store/cartStore'; // Certifique-se de que o caminho está correto

// Definição de Props para receber os dados
interface OrderSummaryProps {
    items: CartItem[];
    formData: {
        cep: string;
        address: string;
        city: string;
        state: string;
        paymentMethod: string;
    };
    formatPrice: (price: number) => string;
    cartTotal: number;
    onEdit: () => void; // Função para voltar e editar
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    items,
    formData,
    formatPrice,
    cartTotal,
    onEdit,
}) => {
    // Mapeamento de Método de Pagamento para exibição
    const paymentMap: { [key: string]: string } = {
        credit_card: 'Cartão de Crédito',
        pix: 'Pix',
    };

    return (
        <div className="order-summary-review-box">
            
            <h2 className="section-subtitle">4. Revisão do Pedido</h2>

            {/* Endereço de Envio */}
            <div className="summary-section">
                <h3>Endereço</h3>
                <p>
                    {formData.address}, {formData.city} - {formData.state}
                </p>
                <p>CEP: {formData.cep}</p>
                <button type="button" onClick={onEdit} className="btn-link">
                    Alterar Endereço
                </button>
            </div>

            {/* Método de Pagamento */}
            <div className="summary-section">
                <h3>Pagamento</h3>
                <p>{paymentMap[formData.paymentMethod] || 'Método não selecionado'}</p>
                <button type="button" onClick={onEdit} className="btn-link">
                    Alterar Pagamento
                </button>
            </div>

            {/* Itens do Pedido */}
            <div className="summary-section items-list-review">
                <h3>Itens ({items.length})</h3>
                {items.map((item) => (
                    <div key={item.product.id} className="item-review">
                        <span className="item-name">
                            {item.quantity}x {item.product.name}
                        </span>
                        <span className="item-price">
                            {formatPrice(item.product.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Totais Finais */}
            <div className="summary-section total-review">
                <div className="total-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="total-row">
                    <span>Frete</span>
                    <span>Grátis</span>
                </div>
                <div className="total-row **total-amount**">
                    <strong>Total a Pagar</strong>
                    <strong>{formatPrice(cartTotal)}</strong>
                </div>
            </div>

        </div>
    );
};

export default OrderSummary;