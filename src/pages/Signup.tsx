import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

       
        console.log('Dados de Cadastro:', formData);
        
        
        alert('Cadastro realizado com sucesso! Redirecionando para o login.');
        navigate('/login'); 
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
                        placeholder="Senha"
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

                    <button type="submit" className="btn-accent signup-button">
                        CADASTRAR
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