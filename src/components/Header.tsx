import React, { useState } from "react";
import { Link } from "react-router-dom";
// FiX é necessário para o menu mobile
import { FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
// ✅ CAMINHO CORRIGIDO E FINAL: store dentro de components
import { useCartStore } from "../components/store/cartStore"; 

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const totalItems = useCartStore((state) =>
        state.items.reduce((total, item) => total + item.quantity, 0)
    );

    return (
        <header className="header-main">
            <div className="container header-content">
                
                {/* Ícone Menu Mobile */}
                <div className="mobile-menu-toggle" onClick={handleMenuToggle}>
                    {isMenuOpen ? (
                        <FiX size={24} className="icon-action" />
                    ) : (
                        <FiMenu size={24} className="icon-action" />
                    )}
                </div>

                <div className="header-logo">
                    <Link to="/" className="header-logo-link">
                        <img src={"/img/LOGO.png"} alt="Laranjodina Logo" className="logo-img" />
                    </Link>
                </div>

                <nav className="header-nav">
                    <Link to="/" className="nav-link">
                        Inicio
                    </Link>
                    <Link to="/lancamentos" className="nav-link">
                        Lançamentos
                    </Link>
                    <Link to="/camisetas" className="nav-link">
                        Camisetas
                    </Link>
                    {/* LINK DE ACESSÓRIOS REMOVIDO */}
                </nav>

                <div className="header-icons">
                    
                    {/* Ícone Login/Cadastro */}
                    <Link to="/cadastro" className="icon-action"><FiUser size={22} /></Link>
                    
                    {/* Ícone Carrinho */}
                    <div className="icon-badge">
                        <Link to="/carrinho">
                            <FiShoppingBag size={22} className="icon-action" />
                            {totalItems > 0 && <span className="count">{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* MENU MOBILE (DRAWER) */}
            <nav className={`mobile-menu-drawer ${isMenuOpen ? "open" : ""}`}>
                <div className="container">
                    
                    {/* Link para Login/Cadastro */}
                    <Link to="/cadastro" className="mobile-nav-link" onClick={handleMenuToggle}>
                        CRIAR CONTA / LOGIN
                    </Link>
                    
                    {/* LINKS PRINCIPAIS MOBILE */}
                    <Link to="/" className="mobile-nav-link" onClick={handleMenuToggle}>Início</Link>
                    <Link to="/lancamentos" className="mobile-nav-link" onClick={handleMenuToggle}>Lançamentos</Link>
                    <Link to="/camisetas" className="mobile-nav-link" onClick={handleMenuToggle}>Camisetas</Link>
                    {/* LINKS ACESSÓRIOS E HIP-HOP REMOVIDOS */}

                    <div className="mobile-menu-actions">
                        <Link to="/carrinho" onClick={handleMenuToggle} className="btn-accent mobile-checkout-btn">
                            Ir para o Carrinho ({totalItems})
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;