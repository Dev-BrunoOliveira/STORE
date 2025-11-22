import React from "react";
import { Link } from "react-router-dom";
// REMOVIDA: A importação de ícones que pode causar erros de runtime
// import { FiTrash2, FiMinusCircle, FiPlusCircle } from "react-icons/fi"; 
import { useCartStore, CartItem } from "./store/cartStore";

const Cart: React.FC = () => {
  // Acessa o estado e as ações do carrinho (Zustand)
  const items = useCartStore((state) => state.items); // Ponto de leitura
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // ... (lógica de aumento/diminuição/cálculo) ...
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

  // Se items.length > 0, renderiza a lista. Se não, a mensagem de vazio.
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

              {/* Controles de Quantidade (CORREÇÃO: Usando texto simples) */}
              <div className="quantity-controls">
                <span
                  className="icon-action text-control"
                  onClick={() => handleDecrease(item)}
                >
                  -
                </span>
                <span>{item.quantity}</span>
                <span
                  className="icon-action text-control"
                  onClick={() => handleIncrease(item)}
                >
                  +
                </span>
              </div>

              {/* Botão de Remover (CORREÇÃO: Usando texto simples) */}
              <button
                onClick={() => removeItem(item.product.id, item.size)}
                className="remove-button icon-action text-control"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* ... (Coluna de Resumo) ... */}
      </div>
    </div>
  );
};

export default Cart;