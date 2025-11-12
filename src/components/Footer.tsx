import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer-main">
      <div className="container">
        {/* Seção Principal de Links */}
        <div className="footer-section">
          {/* Coluna 1: Institucional */}
          <div>
            <h4 className="text-uppercase-black">Institucional</h4>
            <ul>
              <li>
                <Link to="/sobre">A Laranjodina</Link>
              </li>
              <li>
                <Link to="/politica-privacidade">Política de Privacidade</Link>
              </li>
              <li>
                <Link to="/termos-uso">Termos de Uso</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Ajuda e Suporte */}
          <div>
            <h4 className="text-uppercase-black">Ajuda</h4>
            <ul>
              <li>
                <Link to="/trocas-devolucoes">Trocas e Devoluções</Link>
              </li>
              <li>
                <Link to="/rastreio">Rastreie seu Pedido</Link>
              </li>
              <li>
                <Link to="/contato">Fale Conosco</Link>
              </li>
              <li>
                <Link to="/tabela-medidas">Tabela de Medidas</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="text-uppercase-black">Contato</h4>
            <p>WhatsApp: (11) 95237-8064</p>
            <p>E-mail: contato@laranjodinastore.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Laranjodina Store. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
