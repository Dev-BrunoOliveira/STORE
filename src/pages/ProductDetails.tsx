

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi'; 
import { Product } from '../types/Product';
import { getProductBySlug } from '../services/productService'; 
import { useCartStore } from '../components/store/cartStore';



interface DetailedProduct extends Product {
    description: string;
    colors: string[];
    sizes: string[];
}

const ProductDetails: React.FC = () => {
    // Hooks para o estado e o slug da URL
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<DetailedProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Função para adicionar ao carrinho (Zustand)
    const addItem = useCartStore((state) => state.addItem); 

    // Efeito para carregar os dados
    useEffect(() => {
        if (slug) {
            const loadProduct = async () => {
                setIsLoading(true);
                // Busca o produto real (simulado) pelo slug
                const data = await getProductBySlug(slug);

                if (data) {
                    // Adicionando detalhes extras para simulação
                    const detailedData: DetailedProduct = {
                        ...data,
                        description: 'Camiseta Premium Oversized 100% algodão, malha 30.1 penteada. Estampa em silk-screen de alta durabilidade. Perfeita para um visual streetwear autêntico.',
                        colors: ['Preto', 'Branco', 'Cinza'],
                        sizes: ['P', 'M', 'G', 'GG', 'XG'],
                    };
                    setProduct(detailedData);
                    setSelectedSize(detailedData.sizes[0] || null); 
                }
                setIsLoading(false);
            };
            loadProduct();
        }
    }, [slug]); // Roda novamente se o slug (URL) mudar

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            alert('Por favor, selecione um tamanho!');
            return;
        }
        
        // Adiciona o item ao Zustand Store
        addItem(product, selectedSize); 
        alert(`"${product.name} (Tam: ${selectedSize})" adicionado ao carrinho!`);
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    if (isLoading) {
        return <div className="loading-state">Carregando detalhes do produto...</div>;
    }

    if (!product) {
        return (
            <div className="product-details-error">
                <h1 className="text-uppercase-black error-title" style={{ color: 'var(--color-accent)' }}>Produto Não Encontrado</h1>
                <p className="error-message">Verifique a URL ou volte à <Link to="/" style={{ color: 'var(--color-accent)' }}>Home</Link>.</p>
            </div>
        );
    }
    


    return (
        <div className="container product-details-page">
            
            {/* Layout de Duas Colunas */}
            <div className="product-layout-grid">
                
                {/* Coluna 1: Galeria de Imagens */}
                <div className="product-gallery">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="main-image" 
                    />
                    <div className="thumbnail-group">
                        {/* Miniaturas */}
                        <img src={product.imageUrl} alt="Detalhe 1" className="thumbnail active" />
                        <img src="https://via.placeholder.com/100x120/444444?text=Detalhe+2" alt="Detalhe 2" className="thumbnail" />
                    </div>
                </div>
                
                {/* Coluna 2: Detalhes e Ações de Compra */}
                <div className="product-info-box">
                    
                    {/* Nome e Preço */}
                    <h1 className="text-uppercase-black info-title">{product.name}</h1>
                    
                    <div className="price-display">
                        {product.oldPrice && (
                            <span className="price-old">{formatPrice(product.oldPrice)}</span>
                        )}
                        <span className="price-current">{formatPrice(product.price)}</span>
                    </div>

                    {/* Seletor de Tamanho */}
                    <div className="size-selector-group">
                        <p className="size-label">Tamanho: <span style={{ color: 'var(--color-accent)' }}>{selectedSize || 'Selecione'}</span></p>
                        <div className="size-options">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Botão de Adicionar ao Carrinho */}
                    <button
                        onClick={handleAddToCart}
                        className="btn-accent btn-add-cart"
                    >
                        {/* Removendo o ícone para evitar quebras */}
                        <span>🛒 Adicionar ao Carrinho</span>
                    </button>
                    
                    {/* Descrição e Detalhes */}
                    <div className="product-description-box">
                        <h3 className="text-uppercase-black description-title">Descrição</h3>
                        <p className="description-text">{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;