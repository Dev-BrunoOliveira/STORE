import React, { useState } from "react";
import { FiMail, FiMessageSquare, FiSend, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const Contato: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Mensagem enviada com sucesso! Responderemos em breve.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="container signup-page" style={{ maxWidth: "950px", margin: "40px auto" }}>
      <div style={{ background: "var(--surface-color, #181818)", padding: "40px", borderRadius: "12px", border: "1px solid #333" }}>
        <h1 className="text-uppercase-black" style={{ fontSize: "2rem", marginBottom: "10px" }}>
          FALE CONOSCO
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "30px" }}>
          Tem alguma dúvida sobre seu pedido, trocas ou quer bater um papo sobre a marca? Estamos prontos para atender!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
          {/* ── Formulário de Contato ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Seu Nome *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Seu E-mail *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Assunto</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="form-input"
                placeholder="Ex: Dúvida sobre pedido, Troca..."
              />
            </div>

            <div>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Mensagem *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="form-input"
                placeholder="Escreva sua mensagem aqui..."
                style={{ resize: "vertical" }}
              />
            </div>

            <button type="submit" className="btn-accent" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px" }}>
              <FiSend size={18} />
              {loading ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
            </button>
          </form>

          {/* ── Canais de Atendimento ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <div style={{ background: "var(--color-accent)", color: "#000", padding: "10px", borderRadius: "8px" }}>
                  <FiMessageSquare size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>WhatsApp Direto</h3>
                  <small style={{ color: "var(--text-muted)" }}>Atendimento rápido</small>
                </div>
              </div>
              <p style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem", margin: "10px 0" }}>(11) 95237-8064</p>
              <a
                href="https://wa.me/5511952378064?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20a%20Laranjodina%20Store!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
                style={{ display: "inline-block", textDecoration: "none", textAlign: "center", width: "100%", padding: "10px" }}
              >
                Chamar no WhatsApp 💬
              </a>
            </div>

            <div style={{ background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <div style={{ background: "var(--color-accent)", color: "#000", padding: "10px", borderRadius: "8px" }}>
                  <FiMail size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>E-mail Suporte</h3>
                  <small style={{ color: "var(--text-muted)" }}>Resposta em até 24h úteis</small>
                </div>
              </div>
              <p style={{ color: "var(--color-accent)", fontWeight: "bold", margin: "5px 0" }}>contato@laranjodinastore.com</p>
            </div>

            <div style={{ background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #333", color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", marginBottom: "6px" }}>
                <FiClock color="var(--color-accent)" size={16} />
                <strong>Horário de Atendimento:</strong>
              </div>
              <span>Segunda a Sexta-feira: 09:00 às 18:00</span><br />
              <span>Sábados: 09:00 às 13:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
