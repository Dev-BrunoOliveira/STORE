import React from "react";
import { FiRefreshCw, FiClock, FiPackage, FiTruck, FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";

const TrocasDevolucoes: React.FC = () => {
  return (
    <div className="container signup-page" style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div style={{ background: "var(--surface-color, #181818)", padding: "40px", borderRadius: "12px", border: "1px solid #333" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <FiRefreshCw size={32} color="var(--color-accent, #ff6600)" />
          <h1 className="text-uppercase-black" style={{ fontSize: "2rem", margin: 0 }}>
            POLÍTICA DE TROCAS E DEVOLUÇÕES
          </h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
          Na <strong>Laranjodina Store</strong>, queremos que você fique 100% satisfeito com a sua peita! Se precisar trocar o tamanho ou devolver um produto, nossa política é simples, rápida e transparente, seguindo o Código de Defesa do Consumidor (CDC).
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", margin: "30px 0" }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
            <FiClock size={28} color="var(--color-accent)" style={{ marginBottom: "10px" }} />
            <h3 style={{ margin: "0 0 8px 0", color: "#fff" }}>Prazo de Arrependimento</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
              Você tem até <strong>7 dias corridos</strong> após o recebimento do pedido para solicitar a devolução ou troca por qualquer motivo.
            </p>
          </div>

          <div style={{ background: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
            <FiTruck size={28} color="var(--color-accent)" style={{ marginBottom: "10px" }} />
            <h3 style={{ margin: "0 0 8px 0", color: "#fff" }}>Primeira Troca Grátis</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
              O custo do frete do envio de devolução da primeira troca por tamanho ou defeito é <strong>por nossa conta</strong>!
            </p>
          </div>

          <div style={{ background: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
            <FiPackage size={28} color="var(--color-accent)" style={{ marginBottom: "10px" }} />
            <h3 style={{ margin: "0 0 8px 0", color: "#fff" }}>Condições do Produto</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
              A peça deve estar sem marcas de uso, sem odores, não lavada e acompanhada das etiquetas originais afixadas.
            </p>
          </div>
        </div>

        <h2 className="section-subtitle" style={{ fontSize: "1.3rem", marginTop: "30px" }}>
          Passo a Passo para Solicitar a Troca:
        </h2>

        <ol style={{ color: "var(--text-muted)", paddingLeft: "20px", lineHeight: "1.8", fontSize: "0.95rem" }}>
          <li>Envie uma mensagem no nosso <strong>WhatsApp (11) 95237-8064</strong> ou e-mail <strong>contato@laranjodinastore.com</strong> informando o número do seu pedido e o motivo da troca.</li>
          <li>Receba o código de postagem reversa dos Correios (sem custo).</li>
          <li>Embalagem o produto e poste em qualquer agência dos Correios.</li>
          <li>Assim que o produto chegar ao nosso centro de distribuição e for vistoriado, enviaremos a nova peça ou realizaremos o reembolso integral.</li>
        </ol>

        <div style={{ background: "rgba(255, 102, 0, 0.1)", border: "1px solid var(--color-accent)", padding: "15px 20px", borderRadius: "8px", marginTop: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
          <FiAlertTriangle size={24} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#fff" }}>
            Fique atento às medidas antes de comprar! Consulte nossa <Link to="/tabela-medidas" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>Tabela de Medidas</Link> para escolher o tamanho ideal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrocasDevolucoes;
