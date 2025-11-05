// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/Product";
import { FiShoppingCart } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const discountPercent = product.oldPrice
    ? (100 - (product.price / product.oldPrice) * 100).toFixed(0)
    : null;

  return (
    <Link to={`/produto/${product.slug}`} className="product-card">
      <div className="product-card-image">
        <img src={product.imageUrl} alt={product.name} />

        {product.oldPrice && (
          <span className="badge-discount">-{discountPercent}%</span>
        )}
      </div>

      <div className="product-card-details">
        {/* Nome do Produto */}
        <h3 className="product-card-name">{product.name}</h3>

        <div className="price-group">
          {product.oldPrice && (
            <span className="price-old">{formatPrice(product.oldPrice)}</span>
          )}
          <span className="product-card-price">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="btn-card-details"
        >
          <FiShoppingCart size={16} /> <span>Ver Detalhes</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
