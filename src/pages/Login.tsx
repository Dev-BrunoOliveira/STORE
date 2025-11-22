// src/pages/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Preencha e-mail e senha.');
            return;
        }
        
        setIsLoading(true);

        try {
            // Chamada à API Node.js/Express (rota de Login)
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Trata erros 401 (Credenciais inválidas) ou outros erros do servidor
                setError(data.message || 'Erro ao tentar fazer login. Verifique suas credenciais.');
                toast.error(data.message || 'Falha no login.');
                return;
            }

            // Sucesso!
            toast.success('Login bem-sucedido. Bem-vindo!', { icon: '🤘' });
            
            // 💡 1. Salva o JWT retornado no LocalStorage para manter o login
            localStorage.setItem('userToken', data.token);
            
            // 💡 2. Redireciona para a Home
            navigate('/'); 

        } catch (error) {
            console.error("Erro na requisição de login:", error);
            setError('Não foi possível conectar ao servidor. Tente novamente.');
            toast.error('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container signup-page">
            <div className="signup-box">
                <h1 className="text-uppercase-black signup-title">FAÇA LOGIN</h1>
                
                <form className="signup-form" onSubmit={handleSubmit}>
                    
                    {error && <p className="error-message">{error}</p>}
                    
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
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    
                    <button type="submit" className="btn-accent signup-button" disabled={isLoading}>
                        {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
                    </button>
                </form>

                <p className="signup-footer-text">
                    Não tem conta? <Link to="/cadastro" className="signup-link">Crie uma agora</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;