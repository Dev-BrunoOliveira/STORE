import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useCartStore } from "./store/cartStore";

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
                <div className="mobile-menu-toggle" onClick={handleMenuToggle}>
                    {isMenuOpen ? (
                        <FiX size={24} className="icon-action" />
                    ) : (
                        <FiMenu size={24} className="icon-action" />
                    )}
                </div>

                <div className="header-logo">
                    <Link to="/" className="header-logo-link">
                        <img
                            src={"/img/LOGO.png"}
                            alt="Laranjodina Logo"
                            className="logo-img"
                        />
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
                </nav>

                <div className="header-icons">
                    <FiSearch size={22} className="icon-action search-icon-desktop" />
                    
                    {/* 1. LOGIN/CADASTRO NO DESKTOP */}
                    <Link to="/cadastro" className="icon-action">
                        <FiUser size={22} />
                    </Link>

                    <div className="icon-badge">
                        <Link to="/carrinho">
                            <FiShoppingBag size={22} className="icon-action" />
                            {totalItems > 0 && <span className="count">{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </div>

            <nav className={`mobile-menu-drawer ${isMenuOpen ? "open" : ""}`}>
                <div className="container">
                    {/* 2. ADICIONADO: LINK DE CADASTRO NO TOPO DO MENU MOBILE */}
                    <Link to="/cadastro" className="mobile-nav-link" onClick={handleMenuToggle}>
                        CRIAR CONTA / LOGIN
                    </Link>
                    <Link to="/" className="mobile-nav-link" onClick={handleMenuToggle}>
                        Início
                    </Link>
                    <Link
                        to="/lancamentos"
                        className="mobile-nav-link"
                        onClick={handleMenuToggle}
                    >
                        Lançamentos
                    </Link>
                    <Link
                        to="/camisetas"
                        className="mobile-nav-link"
                        onClick={handleMenuToggle}
                    >
                        Camisetas
                    </Link>
                    <Link
                        to="/hiphop"
                        className="mobile-nav-link"
                        onClick={handleMenuToggle}
                    >
                        Hip-hop
                    </Link>

                    <div className="mobile-menu-actions">
                        <Link
                            to="/carrinho"
                            onClick={handleMenuToggle}
                            className="btn-accent mobile-checkout-btn"
                        >
                            Ir para o Carrinho ({totalItems})
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;