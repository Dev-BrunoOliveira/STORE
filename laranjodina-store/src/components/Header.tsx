import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiShoppingBag, FiMenu, FiX, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useCartStore } from "../components/store/cartStore";
import { useAuthStore } from "../components/store/authStore";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((s) =>
    s.items.reduce((t, i) => t + i.quantity, 0)
  );

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    toast.success("Você saiu da conta.");
    navigate("/");
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="header-main">
      <div className="container header-content">
        {/* ── Hamburger mobile ── */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <FiX size={24} className="icon-action" />
          ) : (
            <FiMenu size={24} className="icon-action" />
          )}
        </button>

        {/* ── Logo ── */}
        <div className="header-logo">
          <Link to="/" className="header-logo-link">
            <img src="/img/LOGO.png" alt="Laranjodina" className="logo-img" />
            <span className="header-logo-text">Laranjodina</span>
          </Link>
        </div>

        {/* ── Nav desktop ── */}
        <nav className="header-nav">
          <Link to="/">Início</Link>
          <Link to="/lancamentos">Lançamentos</Link>
          <Link to="/camisetas">Camisetas</Link>
          <Link to="/sobre">Sobre</Link>
        </nav>

        {/* ── Ícones direita ── */}
        <div className="header-icons">
          {user ? (
            /* Usuário logado — dropdown */
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="user-menu-trigger icon-action"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="Minha conta"
              >
                <FiUser size={22} />
                <span className="user-name-chip">{user.name.split(" ")[0]}</span>
                <FiChevronDown size={14} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link
                    to="/minha-conta"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser size={15} /> Minha Conta
                  </Link>
                  <button className="user-dropdown-item danger" onClick={handleLogout}>
                    <FiLogOut size={15} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Não logado */
            <Link to="/login" className="icon-action" aria-label="Login">
              <FiUser size={22} />
            </Link>
          )}

          {/* Carrinho */}
          <div className="icon-badge">
            <Link to="/carrinho" aria-label="Carrinho">
              <FiShoppingBag size={22} className="icon-action" />
              {totalItems > 0 && <span className="count">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Menu mobile drawer ── */}
      <nav className={`mobile-menu-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="container">
          {user ? (
            <>
              <div className="mobile-user-info">
                <FiUser size={18} />
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <Link to="/minha-conta" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Minha Conta
              </Link>
              <button
                className="mobile-nav-link mobile-logout-btn"
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Entrar
              </Link>
              <Link to="/cadastro" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Criar Conta
              </Link>
            </>
          )}

          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Início</Link>
          <Link to="/lancamentos" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Lançamentos</Link>
          <Link to="/camisetas" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Camisetas</Link>
          <Link to="/sobre" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Sobre</Link>

          <Link
            to="/carrinho"
            onClick={() => setIsMenuOpen(false)}
            className="btn-accent mobile-checkout-btn"
          >
            Carrinho ({totalItems})
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
