// src/components/ProductListing.tsx

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Spinner from "../components/Spinner"; 
import { fetchProducts } from "../services/productService";

import { Product } from "../services/productService"; 
// NOTA: Se você ainda usa '../types/Product', mude para o tipo exportado do serviço para estabilidade.


interface ProductListingProps {
  pageTitle: string;
  categorySlug: string;
}

const ProductListing: React.FC<ProductListingProps> = ({
  pageTitle,
  categorySlug,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        
        const data = await fetchProducts(100, categorySlug); 
        setProducts(data);
      } catch (error) {
        console.error(`Erro ao carregar produtos de ${categorySlug}:`, error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug]);

  return (
    <div className="container product-listing-page">
      <h1 className="text-uppercase-black page-title">{pageTitle}</h1>

      {isLoading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="empty-state">
          Nenhum produto encontrado nesta categoria.
        </div>
      ) : (
        <div className="home-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListing;