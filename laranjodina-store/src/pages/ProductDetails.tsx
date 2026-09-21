import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
//import { FiShoppingCart } from "react-icons/fi";
import { Product } from "../types/Product";
import { getProductBySlug, getProductById } from "../services/productService";
import { useCartStore } from "../components/store/cartStore";
import toast from 'react-hot-toast';
import MobileBackButton from '../components/MobileBackButton';
import ReviewSection from '../components/ReviewSection';


interface DetailedProduct extends Product {
  description: string;
  colors: string[];
  sizes: string[];
}

const ProductDetails: React.FC = () => {
  
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Função para adicionar ao carrinho (Zustand)
  const addItem = useCartStore((state) => state.addItem);

  
  useEffect(() => {
    if (slug) {
      const loadProduct = async () => {
        setIsLoading(true);
        // Busca produto por slug ou por ID (caso passe id 21 diretamente)
        let data = await getProductBySlug(slug);
        if (!data) {
          data = await getProductById(slug);
        }

        if (data) {
          setProduct(data);
          setSelectedSize(data.sizes[0] || null);
        }
        setIsLoading(false);
      };
      loadProduct();
    }
  }, [slug]); 

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho!");
      return;
    }

   
    addItem(product, selectedSize);
   toast.success(`"${product.name} (Tam: ${selectedSize})" adicionado!`, {
             icon: '🛒', 
        });
    };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (isLoading) {
    return (
      <div className="loading-state">Carregando detalhes do produto...</div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-error">
        <h1
          className="text-uppercase-black error-title"
          style={{ color: "var(--color-accent)" }}
        >
          Produto Não Encontrado
        </h1>
        <p className="error-message">
          Verifique a URL ou volte à{" "}
          <Link to="/" style={{ color: "var(--color-white)" }}>
            Home
          </Link>
          .
        </p>
      </div>
    );
  }

return (
  <div className="container product-details-page">
    <MobileBackButton text="Ver Mais Produtos" />

    {}
      <div className="product-layout-grid">
        <div className="product-gallery">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="main-image"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== "/img/logo.png") {
                target.src = "/img/logo.png";
              }
            }}
          />
          <div className="thumbnail-group">
            
          </div>
        </div>

        <div className="product-info-box">
          <h1 className="text-uppercase-black info-title">{product.name}</h1>

          <div className="price-display">
            {product.oldPrice && (
              <span className="price-old">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="price-current">{formatPrice(product.price)}</span>
          </div>

          <div className="size-selector-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <p className="size-label" style={{ margin: 0 }}>
                Tamanho:{" "}
                <span style={{ color: "var(--color-accent)" }}>
                  {selectedSize || "Selecione"}
                </span>
              </p>

              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-accent)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: "bold",
                  padding: "4px 0"
                }}
              >
                📏 Guia de Tamanhos
              </button>
            </div>

            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-button ${
                    selectedSize === size ? "active" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {}
          {isSizeGuideOpen && (
            <div
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
                padding: "20px",
              }}
              onClick={() => setIsSizeGuideOpen(false)}
            >
              <div
                style={{
                  background: "#181818",
                  borderRadius: "12px",
                  padding: "25px",
                  maxWidth: "520px",
                  width: "100%",
                  border: "1px solid var(--color-accent)",
                  position: "relative",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  textAlign: "center"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "15px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </button>

                <h2 className="text-uppercase-black" style={{ marginTop: 0, fontSize: "1.2rem", color: "var(--color-accent)", marginBottom: "15px" }}>
                  GUIA DE MEDIDAS OVERSIZED
                </h2>

                <img
                  src="/img/tabela-medidas.png"
                  alt="Tabela de Medidas Camisetas Oversized"
                  style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", border: "1px solid #333" }}
                />
              </div>
            </div>
          )}

          {}
          <button onClick={handleAddToCart} className="btn-accent btn-add-cart">
            {}
            <span>🛒 Adicionar ao Carrinho</span>
          </button>

          {}
          <div className="product-description-box">
            <h3 className="text-uppercase-black description-title">
              Descrição
            </h3>
            <p className="description-text">{product.description}</p>
          </div>

          <ReviewSection productSlug={product.slug} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
