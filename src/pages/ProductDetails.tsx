import React from 'react';
import { useParams } from 'react-router-dom'; 
import { FiShoppingCart } from 'react-icons/fi';
import { Product } from '../types/Product';


const MOCK_PRODUCTS_DB: (Product & { description: string, colors: string[], sizes: string[] })[] = [
    { 
        id: 1, 
        name: 'Camiseta 2Pac', 
        price: 99.90, 
        oldPrice: 199.90, 
        imageUrl: 'img/2PAC PEITA.jpg', 
        slug: 'camiseta-2pac',
        description: 'Camiseta Premium Oversized 100% algodão, malha 30.1 penteada. Perfeita para um visual streetwear autêntico.',
        colors: ['Preto', 'Branco', 'Cinza'],
        sizes: ['P', 'M', 'G', 'GG', 'XG'],
    },
    { 
        id: 2, 
        name: 'Camiseta Fresh Prince', 
        price: 159.90, 
        imageUrl: 'img/WILL PEITA.jpg', 
        slug: 'camiseta-will',
        description: 'Camiseta Premium Oversized 100% algodão, malha 30.1 penteada. Perfeita para um visual streetwear autêntico.',
        colors: ['Preto', 'Branco', 'Cinza'],
        sizes: ['P', 'M', 'G', 'GG', 'XG'],
    },
    { 
        id: 3, 
        name: 'Camiseta Michael Jordan', 
        price: 159.90, 
        imageUrl: 'img/JORDAN PEITA.jpg', 
        slug: 'camiseta-jordan',
        description: 'Camiseta Premium Oversized 100% algodão, malha 30.1 penteada. Perfeita para um visual streetwear autêntico.',
        colors: ['Preto', 'Branco', 'Cinza'],
        sizes: ['P', 'M', 'G', 'GG', 'XG'],
    },
    { 
        id: 4, 
        name: 'Camiseta Leblon James', 
        price: 159.90, 
        imageUrl: 'img/LEBLON PEITA.jpg', 
        slug: 'camiseta-leblon',
        description: 'Camiseta Premium Oversized 100% algodão, malha 30.1 penteada. Perfeita para um visual streetwear autêntico.',
        colors: ['Preto', 'Branco', 'Cinza'],
        sizes: ['P', 'M', 'G', 'GG', 'XG'],
    }
    
];

const ProductDetails: React.FC = () => {
    
    const { slug } = useParams<{ slug: string }>();

   
    const product = MOCK_PRODUCTS_DB.find(p => p.slug === slug);

    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);

 
    if (!product) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold uppercase text-treze-accent">Produto Não Encontrado</h1>
                <p className="mt-4">Verifique a URL ou volte à <a href="/" className="underline text-white">Home</a>.</p>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Por favor, selecione um tamanho!');
            return;
        }
        console.log(`Adicionado ao carrinho: ${product.name}, Tamanho: ${selectedSize}`);
       
    };

    
    return (
        <div className="container mx-auto py-10">
            
            <div className="flex flex-col md:flex-row gap-10">
                
                {/* Coluna 1: Galeria de Imagens */}
                <div className="md:w-3/5">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full object-cover shadow-xl mb-4" 
                    />
                    {/* Miniaturas (Poderiam ser mapeadas em uma array de imagens do produto) */}
                    <div className="flex space-x-3 overflow-x-auto">
                        <img src="https://via.placeholder.com/100x120/444444?text=Detalhe+1" alt="Detalhe 1" className="w-20 h-24 object-cover cursor-pointer border-2 border-treze-accent" />
                        {/* ... */}
                    </div>
                </div>
                
                {/* Coluna 2: Detalhes e Ações de Compra */}
                <div className="md:w-2/5 sticky top-20 bg-gray-900 p-6 rounded-lg shadow-2xl">
                    
                    {/* Nome e Preço (Agora dinâmicos) */}
                    <h1 className="text-4xl font-black uppercase mb-2 leading-tight text-white">{product.name}</h1>
                    
                    {/* ... (renderização de preços) ... */}
                    <div className="flex items-baseline space-x-3 mb-6 border-b border-gray-700 pb-4">
                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                        <span className="text-4xl font-extrabold text-treze-accent">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    {/* Seletor de Tamanho (Agora dinâmico) */}
                    <div className="mb-6">
                        <p className="text-lg font-bold mb-3 uppercase">Tamanho: <span className="text-treze-accent">{selectedSize || 'Selecione'}</span></p>
                        <div className="flex space-x-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`border-2 rounded-md w-12 h-12 flex items-center justify-center font-semibold transition-all ${
                                        selectedSize === size
                                          ? 'bg-treze-accent text-black border-treze-accent'
                                          : 'bg-gray-800 text-white border-gray-700 hover:border-treze-accent'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Botão de Adicionar ao Carrinho */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-white text-black text-xl font-black uppercase py-4 mt-6 flex items-center justify-center space-x-2 shadow-lg transition duration-300 hover:bg-gray-200"
                    >
                        <FiShoppingCart size={24} />
                        <span>Adicionar ao Carrinho</span>
                    </button>
                    
                    {/* Descrição e Detalhes (Agora dinâmicos) */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <h3 className="text-xl font-bold uppercase mb-3">Descrição</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;