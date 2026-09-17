import React from "react";
import { FiSliders, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";

const TabelaMedidas: React.FC = () => {
  return (
    <div className="container signup-page" style={{ maxWidth: "800px", margin: "40px auto" }}>
      <div style={{ background: "var(--surface-color, #181818)", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px", textAlign: "center" }}>
          <FiSliders size={30} color="var(--color-accent, #ff6600)" />
          <h1 className="text-uppercase-black" style={{ fontSize: "1.8rem", margin: 0 }}>
            TABELA DE MEDIDAS (OVERSIZED)
          </h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", textAlign: "center", marginBottom: "25px" }}>
          Nossas camisetas possuem a tradicional <strong>modelagem Streetwear Oversized</strong>. Confira abaixo as medidas oficiais em centímetros (cm):
        </p>

        {/* ── Imagem Oficial do Guia de Medidas (Centralizada e Responsiva) ── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0d0d0d",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid var(--color-accent)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          margin: "0 auto 30px auto"
        }}>
          <img
            src="/img/tabela-medidas.png"
            alt="Tabela Oficial de Medidas Camisetas Oversized Laranjodina"
            style={{
              width: "100%",
              maxWidth: "520px",
              height: "auto",
              objectFit: "contain",
              borderRadius: "8px",
              display: "block"
            }}
          />
        </div>

        {/* ── Dicas de Medição ── */}
        <div style={{ background: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #333", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "1.05rem" }}>
            <FiInfo color="var(--color-accent)" /> Como Medir Sua Peça:
          </h3>
          <ul style={{ color: "var(--text-muted)", paddingLeft: "20px", lineHeight: "1.8", fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto" }}>
            <li><strong>Altura:</strong> Meça do ponto mais alto do ombro (ao lado da gola) até a barra inferior.</li>
            <li><strong>Largura:</strong> Meça na horizontal, logo abaixo das cavas (de axila a axila).</li>
            <li><strong>Manga:</strong> Meça do topo da costura do ombro até o final da barra da manga.</li>
          </ul>
        </div>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "15px" }}>
            * As medidas podem variar em até 2cm.
          </p>
          <Link to="/camisetas" className="btn-accent" style={{ padding: "12px 30px", display: "inline-block" }}>
            Ver Camisetas Disponíveis 🛍️
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TabelaMedidas;
