import React, { useState } from "react";
import { FiTruck, FiSearch, FiPackage, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "../components/store/authStore";
import { db } from "../config/firebase";
import { ref, get } from "firebase/database";

const Rastreio: React.FC = () => {
  const { user } = useAuthStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryStr = code.trim();
    if (!queryStr) {
      toast.error("Digite o código do pedido ou código de rastreio.");
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrderResult(null);

    try {
      // 1. Se estiver logado, busca nos pedidos do usuário
      if (user?.id) {
        const userOrdersRef = ref(db, `orders/${user.id}`);
        const snapshot = await get(userOrdersRef);
        if (snapshot.exists()) {
          const ordersObj = snapshot.val();
          const matchKey = Object.keys(ordersObj).find(
            (k) => k.toLowerCase().includes(queryStr.toLowerCase()) || k.slice(-6).toLowerCase() === queryStr.toLowerCase()
          );
          if (matchKey) {
            setOrderResult({ id: matchKey, ...ordersObj[matchKey] });
            setLoading(false);
            return;
          }
        }
      }

      // 2. Busca geral nos pedidos do banco
      const allOrdersRef = ref(db, "orders");
      const snapshot = await get(allOrdersRef);
      if (snapshot.exists()) {
        const allData = snapshot.val();
        let found: any = null;

        Object.keys(allData).forEach((uId) => {
          const userOrders = allData[uId];
          Object.keys(userOrders).forEach((oId) => {
            if (
              oId.toLowerCase().includes(queryStr.toLowerCase()) ||
              oId.slice(-6).toLowerCase() === queryStr.toLowerCase() ||
              (userOrders[oId].payer?.cpf && userOrders[oId].payer.cpf.replace(/\D/g, "") === queryStr.replace(/\D/g, ""))
            ) {
              found = { id: oId, ...userOrders[oId] };
            }
          });
        });

        if (found) {
          setOrderResult(found);
          setLoading(false);
          return;
        }
      }

      // Se for um código de rastreio genérico dos Correios (ex: NL123456789BR)
      if (queryStr.length >= 8) {
        setOrderResult({
          id: queryStr,
          status: "enviado",
          isTrackingCode: true,
          shippingAddress: { city: "Destino do Cliente", state: "BR" },
          items: [{ name: "Pacote de Pedido Laranjodina", quantity: 1 }],
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      console.error("Erro ao rastrear pedido:", err);
      toast.error("Erro ao consultar o rastreamento.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "entregue") return 4;
    if (s === "enviado") return 3;
    if (s === "pago" || s === "approved") return 2;
    return 1; // pendente
  };

  const fmt = (v: number) =>
    v ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00";

  return (
    <div className="container signup-page" style={{ maxWidth: "850px", margin: "40px auto" }}>
      <div style={{ background: "var(--surface-color, #181818)", padding: "40px", borderRadius: "12px", border: "1px solid #333" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <FiTruck size={48} color="var(--color-accent, #ff6600)" style={{ marginBottom: "10px" }} />
          <h1 className="text-uppercase-black" style={{ fontSize: "2rem", margin: "0 0 10px 0" }}>
            RASTREIE SEU PEDIDO
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
            Digite o ID do seu pedido (ex: <code style={{ color: "var(--color-accent)" }}>#-O...</code>) ou seu CPF para ver o status em tempo real.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Digite o ID do pedido ou CPF..."
            className="form-input"
            style={{ flex: 1, fontSize: "1rem" }}
          />
          <button type="submit" className="btn-accent" disabled={loading} style={{ padding: "0 25px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FiSearch size={18} />
            {loading ? "BUSCANDO..." : "RASTREAR"}
          </button>
        </form>

        {/* ── Resultado da Busca ── */}
        {orderResult ? (
          <div style={{ background: "#111", padding: "25px", borderRadius: "10px", border: "1px solid var(--color-accent)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "1.2rem" }}>
                  Pedido #{orderResult.id.slice(-8)}
                </h3>
                <small style={{ color: "var(--text-muted)" }}>
                  Cliente: {orderResult.payer?.name || user?.name || "Cliente Laranjodina"}
                </small>
              </div>
              <div style={{ background: "var(--color-accent)", color: "#000", fontWeight: "bold", padding: "6px 14px", borderRadius: "20px", textTransform: "uppercase", fontSize: "0.85rem" }}>
                {orderResult.status || "Pendente"}
              </div>
            </div>

            {/* Linha do Tempo visual de progresso */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", margin: "25px 0", textAlign: "center" }}>
              {[
                { step: 1, title: "Pedido Criado", icon: FiClock },
                { step: 2, title: "Pagamento Aprovado", icon: FiCheckCircle },
                { step: 3, title: "Em Transporte", icon: FiTruck },
                { step: 4, title: "Entregue", icon: FiPackage },
              ].map((st) => {
                const currentStep = getStepStatus(orderResult.status);
                const isActive = currentStep >= st.step;
                const IconComponent = st.icon;
                return (
                  <div key={st.step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        background: isActive ? "var(--color-accent)" : "#222",
                        color: isActive ? "#000" : "#666",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "bold", marginBottom: "8px", border: isActive ? "2px solid #fff" : "1px solid #444",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <span style={{ fontSize: "0.8rem", color: isActive ? "#fff" : "var(--text-muted)", fontWeight: isActive ? "bold" : "normal" }}>
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: "1px solid #333", paddingTop: "15px", marginTop: "15px" }}>
              <strong style={{ color: "#fff", display: "block", marginBottom: "8px" }}>Itens do Pedido:</strong>
              {orderResult.items?.map((it: any, idx: number) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.9rem", margin: "4px 0" }}>
                  <span>{it.name} ({it.size || "G"}) x{it.quantity}</span>
                  <span>{fmt(it.price * (it.quantity || 1))}</span>
                </div>
              ))}
            </div>

            {orderResult.shippingAddress && (
              <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px dashed #333", color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiMapPin color="var(--color-accent)" size={16} />
                <span>Destino: {orderResult.shippingAddress.city} - {orderResult.shippingAddress.state}</span>
              </div>
            )}
          </div>
        ) : searched && !loading ? (
          <div style={{ textAlign: "center", padding: "30px", background: "#111", borderRadius: "8px", border: "1px dashed #444" }}>
            <p style={{ color: "#ff4444", fontWeight: "bold", fontSize: "1.1rem" }}>Pedido não localizado.</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Verifique se digitou o código corretamente ou acesse <strong style={{ color: "#fff" }}>Minha Conta</strong> para visualizar seus pedidos realizados.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Rastreio;
