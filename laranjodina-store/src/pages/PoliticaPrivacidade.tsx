import React from "react";
import { FiShield, FiLock, FiEye, FiCheckCircle } from "react-icons/fi";

const PoliticaPrivacidade: React.FC = () => {
  return (
    <div className="container signup-page" style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div style={{ background: "var(--surface-color, #181818)", padding: "40px", borderRadius: "12px", border: "1px solid #333" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <FiShield size={32} color="var(--color-accent, #ff6600)" />
          <h1 className="text-uppercase-black" style={{ fontSize: "2rem", margin: 0 }}>
            POLÍTICA DE PRIVACIDADE
          </h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
          Na <strong>Laranjodina Store</strong>, a privacidade e a segurança dos seus dados pessoais são prioridade absoluta. Esta Política descreve como coletamos, usamos, armazenamos e protegemos suas informações de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "30px" }}>
          <section>
            <h2 className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem" }}>
              <FiEye size={20} color="var(--color-accent)" /> 1. Coleta de Informações
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Coletamos as informações necessárias para processar seus pedidos, garantir a entrega segura e proporcionar uma experiência personalizada. Os dados incluem:
            </p>
            <ul style={{ color: "var(--text-muted)", paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Nome completo, CPF e data de nascimento;</li>
              <li>Endereço de e-mail e telefone para contato/WhatsApp;</li>
              <li>Endereço de entrega e cobrança;</li>
              <li>Histórico de compras e dados de navegação no site.</li>
            </ul>
          </section>

          <section>
            <h2 className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem" }}>
              <FiLock size={20} color="var(--color-accent)" /> 2. Segurança dos Pagamentos
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Todos os pagamentos realizados na Laranjodina Store são processados por gateways seguros de pagamento (como o <strong>Mercado Pago</strong>). <strong>Não armazenamos dados bancários ou números de cartão de crédito em nossos servidores.</strong> Todas as transações trafegam por conexões criptografadas com certificado SSL de 256 bits.
            </p>
          </section>

          <section>
            <h2 className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem" }}>
              <FiCheckCircle size={20} color="var(--color-accent)" /> 3. Compartilhamento de Dados
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Seus dados pessoais <strong>jamais serão vendidos ou comercializados</strong> a terceiros. O compartilhamento ocorre estritamente com parceiros operacionais necessários para a conclusão do serviço:
            </p>
            <ul style={{ color: "var(--text-muted)", paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Transportadoras e Correios para realização da entrega;</li>
              <li>Plataformas de processamento de pagamentos;</li>
              <li>Sistemas de prevenção a fraudes.</li>
            </ul>
          </section>

          <section>
            <h2 className="section-subtitle" style={{ fontSize: "1.2rem" }}>
              4. Seus Direitos (LGPD)
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Você tem total direito de solicitar a confirmação da existência de tratamento dos seus dados, acesso aos dados armazenados, correção de dados incompletos ou a exclusão da sua conta a qualquer momento enviando um e-mail para <strong>contato@laranjodinastore.com</strong>.
            </p>
          </section>
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #333", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Última atualização: Setembro de {new Date().getFullYear()} — Laranjodina Store.
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;
