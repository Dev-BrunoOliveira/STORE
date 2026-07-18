// src/pages/Signup.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';
import { useAuthStore } from '../components/store/authStore';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const storeLogin = useAuthStore((s) => s.login);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }
        
        setIsLoading(true);

        try {
            // Chamada à API Node.js/Express
            const response = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Envia apenas os dados necessários para o Backend
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Trata erros 400 (obrigatório) ou 409 (e-mail duplicado)
                setError(data.message || 'Erro no servidor ao tentar cadastrar.');
                toast.error(data.message || 'Falha no cadastro.');
                return;
            }

            toast.success(`Bem-vindo à Laranjodina, ${data.user?.name?.split(' ')[0]}! 🎉`);
            storeLogin(data.token, data.user);
            navigate('/');

        } catch (error) {
            console.error("Erro na requisição de cadastro:", error);
            setError('Não foi possível conectar ao servidor. Tente novamente.');
            toast.error('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container signup-page">
            <div className="signup-box">
                <h1 className="text-uppercase-black signup-title">CRIE SUA CONTA</h1>
                
                <form className="signup-form" onSubmit={handleSubmit}>
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome Completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Número de Contato (opcional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                    />
                    
                    <div style={{position: 'relative', width: '100%'}}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Senha (mínimo 6 caracteres)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            style={{paddingRight: '50px'}}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', 
                                background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem'
                            }}
                        >
                            {showPassword ? "👁️" : "🙈"}
                        </button>
                    </div>
                    
                    <div style={{position: 'relative', width: '100%'}}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirme a Senha"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-input"
                            style={{paddingRight: '50px'}}
                        />
                    </div>

                    <button type="submit" className="btn-accent signup-button" disabled={isLoading}>
                        {isLoading ? 'CADASTRANDO...' : 'CADASTRAR'}
                    </button>
                </form>

                <p className="signup-footer-text">
                    Já tem conta? <Link to="/login" className="signup-link">Faça Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;