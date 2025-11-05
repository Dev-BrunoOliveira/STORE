import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/Product";

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Camiseta 2PAC",
    price: 99.9,
    oldPrice: 119.9,
    imageUrl: "img/2PAC PEITA.jpg",
    slug: "camiseta-2pac",
  },
  {
    id: 2,
    name: "Camiseta Fresh Prince",
    price: 119.9,
    imageUrl: "img/WILL PEITA.jpg",
    slug: "camiseta-will",
  },
  {
    id: 3,
    name: "Camiseta Michael Jordan",
    price: 119.9,
    imageUrl: "img/JORDAN PEITA.jpg",
    slug: "camiseta-jordan",
  },
  {
    id: 4,
    name: "Camiseta Leblon James",
    price: 119.9,
    imageUrl: "img/LEBLON PEITA.jpg",
    slug: "camiseta-leblon",
  },
];

const Home: React.FC = () => {
  return (
    <div className="page-home">
      <section className="home-section home-hero">
        <div
          className="home-hero-bg"
          style={{ backgroundImage: "url('img/Muro.jpg')" }}
        ></div>

        <div className="hero-content">
          <h2 className="text-uppercase-black hero-title">
            <span style={{ color: "var(--color-accent)" }}>A Vitamina C</span>{" "}
            Que Você Precisa
            <br />
          </h2>

          <Link to="/lancamentos" className="btn-accent hero-button">
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* 2. Destaques/Produtos em Grade */}
      <section className="home-section">
        <h3 className="text-uppercase-black section-title">Mais Vendidos</h3>

        {/* Usando a classe de grid de produtos */}
        <div className="home-grid">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Seção de Categorias */}
      <section className="home-section">
        {/* Usando a classe de grid de categorias */}
        <div className="category-grid">
          {/* Bloco 1 */}
          <Link to="/categoria/camisetas" className="category-block">
            Camisetas
          </Link>

          {/* Bloco 2 */}
          <Link to="/categoria/lançamentos" className="category-block">
            Lançamentos
          </Link>

          {/* Bloco 3 */}
          <Link to="/categoria/hiphop" className="category-block">
            Hiphop
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
