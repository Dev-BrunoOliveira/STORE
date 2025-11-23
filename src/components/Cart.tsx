import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiTrash2, FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { useCartStore, CartItem } from "../components/store/cartStore";

const Cart: React.FC = () => {
  const navigate = useNavigate();

  // 2. NOVOS ESTADOS PARA FRETE
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartTotal = subtotal + (shipping === null ? 0 : shipping);

  const handleIncrease = (item: CartItem) => {
    updateQuantity(item.product.id, item.size, item.quantity + 1);
  };

  const handleDecrease = (item: CartItem) => {
    updateQuantity(item.product.id, item.size, item.quantity - 1);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    
   
    const cepClean = cep.replace(/\D/g, ''); 

    if (cepClean.length !== 8) { 
        setShipping(null);
        alert('CEP inválido. Digite 8 dígitos.');
        return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);

      // Lógica de MOCK (Exemplo: Frete Grátis acima de R$300)
      if (subtotal >= 300) {
        setShipping(0);
      }
      // Frete Alto
      else if (cepClean.startsWith("0") || cepClean.startsWith("1")) {
        setShipping(15.0);
      }
      // Frete Normal
      else {
        setShipping(35.0);
      }
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1 className="text-uppercase-black cart-header-title">
          Seu Carrinho Está Vazio
        </h1>
        <p className="empty-cart-message">
          Adicione umas peças para começar a rolê!
        </p>
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

              <button
                onClick={() => removeItem(item.product.id, item.size)}
                className="remove-button icon-action"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h2 className="text-uppercase-black">Resumo</h2>

          <div className="summary-line">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <form
            onSubmit={handleCalculateShipping}
            className="shipping-form-group"
          >
            <input
              type="text"
              placeholder="Calcular Frete (CEP)"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              maxLength={9}
              className="form-input"
            />
          </form>

          <div className="summary-line">
            <span>Frete:</span>
            <span>
              {shipping === null ? (
                "A calcular"
              ) : shipping === 0 ? (
                <span className="free-shipping">GRÁTIS</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          <div className="summary-line summary-total">
            <span>Total:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-accent btn-checkout"
          >
            FINALIZAR COMPRA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
