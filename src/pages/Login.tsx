import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 💡 Lógica de Login com a API (Futuro)
        // Nesta fase, vamos apenas simular a validação:
        if (formData.email === 'teste@laranjodina.com' && formData.password === '123456') {
            alert('Login bem-sucedido! Redirecionando para a Home.');
            navigate('/'); // Redireciona para a Home
        } else {
            setError('E-mail ou senha incorretos.');
            return;
        }
    };

    return (
        <div className="container signup-page"> {/* Reutiliza a classe de layout centralizado */}
            <div className="signup-box"> {/* Reutiliza o box de estilização */}
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
                    
                    <button type="submit" className="btn-accent signup-button">
                        ENTRAR
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