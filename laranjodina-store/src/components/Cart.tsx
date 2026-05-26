import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, CartItem } from "../components/store/cartStore";

interface CepInfo {
  city: string;
  state: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const [cep, setCep] = useState("");
  const [cepInfo, setCepInfo] = useState<CepInfo | null>(null);
  const [cepError, setCepError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [shipping, setShipping] = useState<number | null>(null);

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
  const cartTotal = subtotal + (shipping ?? 0);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    if (cepError) setCepError("");
    if (cepInfo) { setCepInfo(null); setShipping(null); }
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setCepError("CEP inválido. Digite 8 dígitos.");
      return;
    }

    setCepLoading(true);
    setCepError("");
    setCepInfo(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        setShipping(null);
        return;
      }

      setCepInfo({ city: data.localidade, state: data.uf });

      // Frete grátis acima de R$300; Sul/Sudeste R$15; demais R$35
      if (subtotal >= 300) {
        setShipping(0);
      } else {
        const regiao = ["SP", "RJ", "MG", "ES", "RS", "SC", "PR"];
        setShipping(regiao.includes(data.uf) ? 15.0 : 35.0);
      }
    } catch {
      setCepError("Erro ao consultar CEP. Tente novamente.");
      setShipping(null);
    } finally {
      setCepLoading(false);
    }
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
        Meu Carrinho ({items.length} {items.length === 1 ? "item" : "itens"})
      </h1>

      <div className="cart-layout-grid">
        <div className="cart-items-list">
          {items.map((item: CartItem) => (
            <div key={`${item.product.id}-${item.size}`} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} />

              <div className="item-details">
                <h2>{item.product.name}</h2>
                <p>Tamanho: <strong>{item.size}</strong></p>
                <p className="item-price-total">
                  {fmt(item.product.price * item.quantity)}
                </p>
              </div>

              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() =>
                    updateQuantity(item.product.id, item.size, item.quantity - 1)
                  }
                  aria-label="Diminuir"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() =>
                    updateQuantity(item.product.id, item.size, item.quantity + 1)
                  }
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.product.id, item.size)}
                className="remove-button"
                aria-label="Remover item"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h2 className="text-uppercase-black">Resumo</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>

          <form onSubmit={handleCalculateShipping} className="cep-form">
            <label className="cep-label">Calcular Frete</label>
            <div className="cep-input-row">
              <input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={handleCepChange}
                maxLength={9}
                className="form-input"
                inputMode="numeric"
              />
              <button
                type="submit"
                className="btn-accent btn-cep"
                disabled={cepLoading}
              >
                {cepLoading ? "..." : "OK"}
              </button>
            </div>
            {cepError && <p className="cep-error">{cepError}</p>}
            {cepInfo && (
              <p className="cep-result">
                📍 {cepInfo.city} — {cepInfo.state}
              </p>
            )}
          </form>

          <div className="summary-line">
            <span>Frete</span>
            <span>
              {shipping === null ? (
                <span className="text-muted">Informe o CEP</span>
              ) : shipping === 0 ? (
                <span className="free-shipping">GRÁTIS</span>
              ) : (
                fmt(shipping)
              )}
            </span>
          </div>

          <div className="summary-line summary-total">
            <span>Total</span>
            <span>{fmt(cartTotal)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-accent btn-checkout"
          >
            FINALIZAR COMPRA
          </button>

          <Link to="/" className="continue-shopping">
            ← Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
