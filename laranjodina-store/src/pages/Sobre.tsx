// src/pages/Sobre.tsx

import React from "react";
import { Link } from "react-router-dom";

const Sobre: React.FC = () => {
  return (
    <div className="container about-page">
      <h1 className="text-uppercase-black about-title">
        A HISTÓRIA DA LARANJODINA
      </h1>

      <div className="about-content-grid">
        <div className="about-text-section">
          <h2 className="section-subtitle">
            A Essência Urbana e o Primeiro Esboço
          </h2>
          <p>
            A Laranjodina Store nasceu de uma frustração simples: a dificuldade
            de encontrar roupas que unissem a qualidade premium com a estética
            autêntica e vibrante do streetwear brasileiro. Em 2023, o fundador,
            inspirado pela efervescência cultural das periferias, rabiscou o
            primeiro logo da marca em um papel. Este desenho inicial, simples e
            cheio de energia, representava a união da cultura de rua com a cor
            que simboliza energia e criatividade: o laranjo (uma laranja com
            minhas caracteristicas), o apelido "Dina", que é uma abreviação de
            "dinamite" então surgiu o nome "Laranjodina".
          </p>
          <p>
            Nossa missão sempre foi clara: vender mais do que camisetas; vender
            uma atitude. O nome "Laranjodina" une essa vibração (Laranja).
          </p>

          <h2 className="section-subtitle" style={{ marginTop: "2rem" }}>
            O Design Final e a Missão
          </h2>
          <p>
            Após meses de refinamento, a identidade visual se solidificou,
            abraçando o contraste forte do preto e laranja e a tipografia que
            remete à arte de rua. A primeira coleção, focada em estampas que
            homenageiam ícones da cultura Hip-hop e NBA, foi um sucesso
            imediato. Hoje, a Laranjodina continua dedicada a ser a "vitamina C"
            que você precisa: um toque de energia, cor e originalidade no seu
            guarda-roupa.
          </p>
          <Link
            to="/camisetas"
            className="btn-accent"
            style={{ marginTop: "2rem" }}
          >
            Compre Nossa Última Coleção
          </Link>
        </div>

        <div className="about-image-section">
          <div className="image-card">
            <img
              src="/img/Base.jpg"
              alt="Esboço Inicial da Marca"
              className="about-img"
            />
            <p className="image-caption">O esboço inicial rabiscado em 2023.</p>
          </div>

          <div className="image-card">
            <img
              src="/img/DINA.jpg"
              alt="Logo Final da Laranjodina"
              className="about-img"
            />
            <p className="image-caption">
              O logo final que define nossa identidade visual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
