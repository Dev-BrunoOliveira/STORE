

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/Product";

import { fetchProducts } from "../services/productService"; 


const Home: React.FC = () => {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //  Função para buscar os produtos ao montar o componente
        const loadProducts = async () => {
            setIsLoading(true);
            try {
                // Busca  produtos (os mais vendidos)
                const data = await fetchProducts(4, 'mais-vendidos'); 
                setProducts(data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []); // O array vazio garante que o efeito rode apenas uma vez

    return (
        <div className="page-home">
            
            {/* 1. Hero Section */}
            <section className="home-section home-hero">
                <div className="home-hero-bg"
                    style={{ backgroundImage: "url('/img/Muro.jpg')" }}>
                </div>
                
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

                {/* 4. Tratamento de Loading */}
                {isLoading ? (
                    <div className="loading-state">Carregando produtos...</div>
                ) : (
                    <div className="home-grid">
                        {/* 5. Renderiza os produtos carregados do estado */}
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* 3. Seção de Categorias (Links corrigidos) */}
            <section className="home-section">
                <div className="category-grid">
                    <Link to="/camisetas" className="category-block">Camisetas</Link>
                    <Link to="/lancamentos" className="category-block">Lançamentos</Link>
                    <Link to="/hiphop" className="category-block">Hiphop</Link>
                </div>
            </section>
            
        </div>
    );
};

export default Home;