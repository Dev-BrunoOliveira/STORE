import React from "react";
import { FiFileText, FiCheck, FiShoppingBag, FiAlertCircle } from "react-icons/fi";

const TermosUso: React.FC = () => {
  return (
    <div className="container signup-page" style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div style={{ background: "var(--surface-color, #181818)", padding: "40px", borderRadius: "12px", border: "1px solid #333" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <FiFileText size={32} color="var(--color-accent, #ff6600)" />
          <h1 className="text-uppercase-black" style={{ fontSize: "2rem", margin: 0 }}>
            TERMOS DE USO
          </h1>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
          Bem-vindo à <strong>Laranjodina Store</strong>. Ao acessar ou efetuar compras em nosso site, você concorda com os termos e condições descritos abaixo. Recomendamos a leitura atenta deste documento.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "30px" }}>
          <section>
            <h2 className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem" }}>
              <FiShoppingBag size={20} color="var(--color-accent)" /> 1. Compras e Pedidos
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Todos os pedidos estão sujeitos à confirmação de pagamento e disponibilidade de estoque. A Laranjodina Store reserva-se o direito de recusar ou cancelar qualquer pedido por motivos de fraude suspeita, inconsistência de dados ou erro sistêmico na exibição de preços.
            </p>
          </section>

          <section>
            <h2 className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem" }}>
              <FiCheck size={20} color="var(--color-accent)" /> 2. Preços e Formas de Pagamento
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Os preços dos produtos são exibidos em Reais (R$) e podem sofrer alterações sem aviso prévio. Aceitamos pagamentos via PIX (aprovação instantânea) e Cartão de Crédito (via Mercado Pago). Em caso de divergência de valor, o preço válido é o confirmado no resumo final do checkout.
            </p>
          </section>

          <section>
            <h2 className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem" }}>
              <FiAlertCircle size={20} color="var(--color-accent)" /> 3. Propriedade Intelectual
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              Todo o conteúdo visual do site, incluindo marca, logo Laranjodina, estampas de camisetas, fotos de modelos, textos e elementos gráficos são de propriedade exclusiva da Laranjodina Store. É proibida a reprodução, cópia ou distribuição sem autorização prévia por escrito.
            </p>
          </section>

          <section>
            <h2 className="section-subtitle" style={{ fontSize: "1.2rem" }}>
              4. Alterações nos Termos
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
              A Laranjodina Store pode revisar estes Termos de Uso periodicamente. As alterações entram em vigor imediatamente após sua publicação no site. O uso continuado da plataforma implica aceitação dos termos atualizados.
            </p>
          </section>
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #333", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Laranjodina Store — Atitude e Estilo Streetwear.
        </div>
      </div>
    </div>
  );
};

export default TermosUso;
