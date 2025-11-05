import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingBag, FiMenu } from "react-icons/fi";
import { useCartStore } from "./store/cartStore";

const Header: React.FC = () => {
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <header className="header-main">
      <div className="container header-content">
        <div className="mobile-menu-toggle">
          <FiMenu size={24} className="icon-action" />
        </div>

        <div className="header-logo">
          <Link to="/" className="header-logo-link">
            <img 
                
                src={'/img/logo.png'} 
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
          <Link to="/acessorios" className="nav-link">
            Acessórios
          </Link>
        </nav>

        <div className="header-icons">
          <FiSearch size={22} className="icon-action search-icon-desktop" />
          <FiUser size={22} className="icon-action" />

          <div className="icon-badge">
            <Link to="/carrinho">
              <FiShoppingBag size={22} className="icon-action" />

              {totalItems > 0 && <span className="count">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;