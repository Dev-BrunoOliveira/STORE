import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiShoppingBag, FiLogOut, FiMail, FiPhone, FiMapPin, FiEdit2 } from "react-icons/fi";
import { useAuthStore } from "../components/store/authStore";
import toast from "react-hot-toast";
import { API_BASE } from "../config/api";

const MinhaConta: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="container order-status-page">
        <div className="order-status-box">
          <div className="order-status-icon">🔒</div>
          <h1 className="text-uppercase-black">Acesso Restrito</h1>
          <p>Faça login para acessar sua conta.</p>
          <Link to="/login" className="btn-accent order-status-btn">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Você saiu da conta.");
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Perfil atualizado!');
        if (token && data.user) {
          login(token, data.user);
        }
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Erro ao atualizar.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao salvar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="container account-page">
      <h1 className="text-uppercase-black account-title">Minha Conta</h1>

      <div className="account-grid">
        {/* ── Card do perfil ── */}
        <div className="account-profile-card">
          <div className="account-avatar">{initials}</div>
          <h2 className="account-name">{user.name}</h2>
          <p className="account-email">
            <FiMail size={14} /> {user.email}
          </p>

          <div className="account-actions">
            <Link to="/carrinho" className="account-action-btn">
              <FiShoppingBag size={16} /> Ver Carrinho
            </Link>
            <button className="account-action-btn danger" onClick={handleLogout}>
              <FiLogOut size={16} /> Sair da Conta
            </button>
          </div>
        </div>

        {/* ── Info / pedidos ── */}
        <div className="account-info-col">
          <div className="account-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="account-section-title" style={{ margin: 0 }}>
                <FiUser size={16} /> Dados Pessoais
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <FiEdit2 size={14} /> Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nome Completo</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>E-mail (Não editável)</label>
                  <input type="email" value={user.email} className="form-input" disabled style={{ opacity: 0.5 }} />
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Celular / WhatsApp</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Endereço Completo</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" placeholder="Rua, Número, Bairro, Cidade - Estado" />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn-accent" disabled={isSubmitting} style={{ padding: '10px 20px' }}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-accent" style={{ background: '#333', color: '#fff', padding: '10px 20px' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="account-info-row">
                  <span className="account-info-label">Nome</span>
                  <span>{user.name}</span>
                </div>
                <div className="account-info-row">
                  <span className="account-info-label">E-mail</span>
                  <span>{user.email}</span>
                </div>
                <div className="account-info-row">
                  <span className="account-info-label"><FiPhone size={14}/> Celular</span>
                  <span>{user.phone || 'Não informado'}</span>
                </div>
                <div className="account-info-row">
                  <span className="account-info-label"><FiMapPin size={14}/> Endereço</span>
                  <span>{user.address || 'Não informado'}</span>
                </div>
                <div className="account-info-row">
                  <span className="account-info-label">ID da Conta</span>
                  <span className="account-info-id">#{user.id}</span>
                </div>
              </>
            )}
          </div>

          <div className="account-section-card">
            <h3 className="account-section-title">
              <FiShoppingBag size={16} /> Meus Pedidos
            </h3>
            <p className="account-empty-msg">
              Histórico de pedidos em breve. Continue comprando! 🛍️
            </p>
            <Link to="/" className="btn-accent account-shop-btn">
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaConta;
