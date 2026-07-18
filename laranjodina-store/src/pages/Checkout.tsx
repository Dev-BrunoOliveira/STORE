import React, { useState } from "react";
import { useCartStore } from "../components/store/cartStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileBackButton from "../components/MobileBackButton";
import { useAuthStore } from "../components/store/authStore";
import { API_BASE as API } from "../config/api";

interface FormData {
  name: string;
  email: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: "credit_card" | "pix";
}

interface PixData {
  paymentId: number;
  total: number;
  qrCode: string;
  qrCodeBase64: string;
}

type Step = "form" | "pix";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user, token } = useAuthStore();

  React.useEffect(() => {
    if (!token) {
      toast.error("Faça login para finalizar a compra.");
      navigate("/login");
    }
  }, [token, navigate]);

  const [step, setStep] = useState<Step>("form");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    cpf: "",
    cep: "", street: "", number: "",
    complement: "", neighborhood: "", city: "", state: "",
    paymentMethod: "pix",
  });

  const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const formatCpf = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cep") formatted = formatCep(value);
    if (name === "cpf") formatted = formatCpf(value);
    setForm(prev => ({ ...prev, [name]: formatted }));
  };

  const fetchCep = async () => {
    const clean = form.cep.replace(/\D/g, "");
    if (clean.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) { toast.error("CEP não encontrado."); return; }

      setForm(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
    } catch {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const buildOrderPayload = () => ({
    items: items.map(i => ({
      slug: i.product.slug,
      quantity: i.quantity,
      size: i.size,
    })),
    payer: { name: form.name, email: form.email, cpf: form.cpf },
    shippingAddress: {
      cep: form.cep,
      street: form.street,
      number: form.number,
      complement: form.complement,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
    },
  });

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Carrinho vazio!"); return; }

    setIsLoading(true);
    try {
      const authHeaders = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (form.paymentMethod === "pix") {
        const res = await fetch(`${API}/api/orders/pix`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(buildOrderPayload()),
        });
        const data = await res.json();
        if (res.status === 401) { navigate("/login"); throw new Error("Sessão expirada. Faça login novamente."); }
        if (!res.ok) throw new Error(data.message || "Erro ao gerar PIX.");

        setPixData(data);
        setStep("pix");
        clearCart();
      } else {
        const res = await fetch(`${API}/api/orders/preference`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(buildOrderPayload()),
        });
        const data = await res.json();
        if (res.status === 401) { navigate("/login"); throw new Error("Sessão expirada. Faça login novamente."); }
        if (!res.ok) throw new Error(data.message || "Erro ao criar pagamento.");

        const url = data.initPoint;
        clearCart();
        window.location.href = url;
      }
    } catch (err: any) {
      const msg = err.message || "Erro ao processar pagamento.";
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("live credentials")) {
        toast.error("PIX indisponível: ative a chave PIX no painel do Mercado Pago.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData?.qrCode) return;
    await navigator.clipboard.writeText(pixData.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ─── Tela de PIX gerado ───────────────────────────────────────────────────
  if (step === "pix" && pixData) {
    return (
      <div className="container pix-page">
        <div className="pix-success-box">
          <div className="pix-icon">✅</div>
          <h1 className="text-uppercase-black pix-title">Pedido Criado!</h1>
          <p className="pix-subtitle">
            Pague com PIX para confirmar. O pedido expira em <strong>30 minutos</strong>.
          </p>

          <div className="pix-total-badge">{fmt(pixData.total)}</div>

          {pixData.qrCodeBase64 ? (
            <div className="pix-qr-wrapper">
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code PIX"
                className="pix-qr-img"
              />
            </div>
          ) : (
            <div className="pix-qr-placeholder">QR Code indisponível</div>
          )}

          {pixData.qrCode && (
            <div className="pix-copy-section">
              <p className="pix-copy-label">Ou copie o código PIX:</p>
              <div className="pix-code-box">
                <span className="pix-code-text">{pixData.qrCode.slice(0, 40)}…</span>
                <button
                  className="btn-accent btn-copy"
                  onClick={handleCopyPix}
                >
                  {copied ? "✓ Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}

          <p className="pix-id">ID do pagamento: #{pixData.paymentId}</p>

          <button
            className="btn-outline btn-home"
            onClick={() => navigate("/")}
          >
            Voltar à loja
          </button>
        </div>
      </div>
    );
  }

  // ─── Formulário de checkout ───────────────────────────────────────────────
  return (
    <div className="container checkout-page">
      <MobileBackButton text="Voltar ao Carrinho" />

      <h1 className="text-uppercase-black checkout-title">Finalizar Compra</h1>

      <form onSubmit={handleFinalize} className="checkout-layout-grid">
        {/* ── Coluna esquerda ── */}
        <div className="checkout-left">
          {/* Dados pessoais */}
          <section className="checkout-section">
            <h2 className="section-subtitle">1. Dados Pessoais</h2>
            <div className="form-group">
              <input
                name="name" type="text" placeholder="Nome completo"
                required value={form.name} onChange={handleChange}
                className="form-input"
              />
              <input
                name="email" type="email" placeholder="E-mail"
                required value={form.email} onChange={handleChange}
                className="form-input"
              />
              <input
                name="cpf" type="text" placeholder="CPF (opcional)"
                value={form.cpf} onChange={handleChange}
                className="form-input" inputMode="numeric"
              />
            </div>
          </section>

          {/* Endereço */}
          <section className="checkout-section">
            <h2 className="section-subtitle">2. Endereço de Envio</h2>
            <div className="form-group">
              <div className="cep-input-row">
                <input
                  name="cep" type="text" placeholder="CEP"
                  required value={form.cep} onChange={handleChange}
                  onBlur={fetchCep}
                  className="form-input" inputMode="numeric" maxLength={9}
                />
                <button
                  type="button"
                  className="btn-accent btn-cep"
                  onClick={fetchCep}
                  disabled={cepLoading}
                >
                  {cepLoading ? "..." : "Buscar"}
                </button>
              </div>

              <input
                name="street" type="text" placeholder="Rua / Logradouro"
                required value={form.street} onChange={handleChange}
                className="form-input"
              />

              <div className="form-row">
                <input
                  name="number" type="text" placeholder="Número"
                  required value={form.number} onChange={handleChange}
                  className="form-input form-input--sm"
                />
                <input
                  name="complement" type="text" placeholder="Complemento (opcional)"
                  value={form.complement} onChange={handleChange}
                  className="form-input"
                />
              </div>

              <input
                name="neighborhood" type="text" placeholder="Bairro"
                required value={form.neighborhood} onChange={handleChange}
                className="form-input"
              />

              <div className="form-row">
                <input
                  name="city" type="text" placeholder="Cidade"
                  required value={form.city} onChange={handleChange}
                  className="form-input"
                />
                <input
                  name="state" type="text" placeholder="UF"
                  required value={form.state} onChange={handleChange}
                  className="form-input form-input--xs" maxLength={2}
                />
              </div>
            </div>
          </section>

          {/* Pagamento */}
          <section className="checkout-section">
            <h2 className="section-subtitle">3. Pagamento</h2>

            <div className="payment-options">
              <label
                className={`payment-option ${form.paymentMethod === "pix" ? "active" : ""}`}
              >
                <input
                  type="radio" name="paymentMethod" value="pix"
                  checked={form.paymentMethod === "pix"}
                  onChange={handleChange}
                />
                <span className="payment-option-icon">⚡</span>
                <div>
                  <strong>PIX</strong>
                  <small>Aprovação instantânea</small>
                </div>
              </label>

              <label
                className={`payment-option ${form.paymentMethod === "credit_card" ? "active" : ""}`}
              >
                <input
                  type="radio" name="paymentMethod" value="credit_card"
                  checked={form.paymentMethod === "credit_card"}
                  onChange={handleChange}
                />
                <span className="payment-option-icon">💳</span>
                <div>
                  <strong>Cartão de Crédito</strong>
                  <small>Via Mercado Pago</small>
                </div>
              </label>
            </div>

            {form.paymentMethod === "credit_card" && (
              <div className="mp-info-box">
                <img
                  src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadopago/logo__large@2x.png"
                  alt="Mercado Pago"
                  className="mp-logo"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <p>Você será redirecionado para o ambiente seguro do <strong>Mercado Pago</strong> para preencher os dados do cartão.</p>
              </div>
            )}

            {form.paymentMethod === "pix" && (
              <div className="pix-info-box">
                <p>⚡ O QR Code será gerado após confirmar o pedido.</p>
              </div>
            )}
          </section>
        </div>

        {/* ── Coluna direita ── */}
        <div className="checkout-right">
          <div className="checkout-summary-box">
            <h2 className="section-subtitle">Resumo do Pedido</h2>

            <div className="summary-items">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="summary-item">
                  <span className="item-name">
                    {item.product.name}
                    <small> ({item.size}) ×{item.quantity}</small>
                  </span>
                  <span className="item-price">
                    {fmt(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="total-line">
                <span>Frete</span>
                <span className="free-shipping">GRÁTIS</span>
              </div>
              <div className="total-line total-final">
                <span>Total</span>
                <span>{fmt(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-accent btn-finalize"
              disabled={isLoading || items.length === 0}
            >
              {isLoading
                ? "PROCESSANDO..."
                : form.paymentMethod === "pix"
                ? "GERAR PIX"
                : "IR PARA PAGAMENTO"}
            </button>

            <p className="security-info">🔒 Pagamento 100% seguro</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
