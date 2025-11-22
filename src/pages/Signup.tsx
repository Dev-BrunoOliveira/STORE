// src/pages/Signup.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Para notificações visuais (em vez de alert)

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

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
            const response = await fetch('http://localhost:3001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Envia apenas os dados necessários para o Backend
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
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

            // Sucesso!
            toast.success('Cadastro realizado e login automático!', { icon: '🎉' });
            
            // 💡 1. Salva o JWT retornado no LocalStorage para manter o login
            localStorage.setItem('userToken', data.token);
            
            // 💡 2. Redireciona para a Home (ou para o Dashboard do usuário)
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
                        type="password"
                        name="password"
                        placeholder="Senha (mínimo 6 caracteres)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme a Senha"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

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