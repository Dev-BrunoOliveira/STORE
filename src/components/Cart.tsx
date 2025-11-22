import React from "react";
import { Link } from "react-router-dom";
// Ícones removidos
import { useCartStore, CartItem } from "./store/cartStore";

const Cart: React.FC = () => {
  // Acessa o estado e as ações do carrinho (Zustand)
  const items = useCartStore((state) => state.items); 
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Lógica de aumento/diminuição/cálculo
  const handleIncrease = (item: CartItem) => {
    updateQuantity(item.product.id, item.size, item.quantity + 1);
  };

  const handleDecrease = (item: CartItem) => {
    updateQuantity(item.product.id, item.size, item.quantity - 1);
  };

  const cartTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Renderização Condicional
  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1 className="text-uppercase-black cart-header-title">
          Seu Carrinho Está Vazio
        </h1>
        <p className="empty-cart-message">Adicione umas peças para começar a rolê!</p>
        <Link to="/" className="btn-accent empty-cart-button">
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="text-uppercase-black cart-header-title">
        Meu Carrinho ({items.length} itens)
      </h1>

      <div className="cart-layout-grid">
        <div className="cart-items-list">
          {items.map((item: CartItem) => (
            <div key={`${item.product.id}-${item.size}`} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} />

              <div className="item-details">
                <h2>{item.product.name}</h2>
                <p>Tamanho: {item.size}</p>
                <p className="item-price-total">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>

              {/* Controles de Quantidade (CORREÇÃO: USANDO TEXTO) */}
              <div className="quantity-controls">
                <span
                  className="icon-action text-control"
                  onClick={() => handleDecrease(item)}
                >
                  - {/* Substituindo FiMinusCircle */}
                </span>
                <span>{item.quantity}</span>
                <span
                  className="icon-action text-control"
                  onClick={() => handleIncrease(item)}
                >
                  + {/* Substituindo FiPlusCircle */}
                </span>
              </div>

              {/* Botão de Remover (CORREÇÃO: USANDO TEXTO) */}
              <button
                onClick={() => removeItem(item.product.id, item.size)}
                className="remove-button icon-action"
              >
                X {/* Substituindo FiTrash2 */}
              </button>
            </div>
          ))}
        </div>

        {/* Coluna de Resumo */}
        <div className="cart-summary-box">
          <h2 className="text-uppercase-black">Resumo</h2>

          <div className="summary-line">
            <span>Subtotal:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="summary-line">
            <span>Frete:</span>
            <span className="free-shipping">Grátis</span>
          </div>

          <div className="summary-line summary-total">
            <span>Total:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <button className="btn-accent btn-checkout">Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;