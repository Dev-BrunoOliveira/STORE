import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message || 'E-mail enviado! Verifique sua caixa de entrada.');
            } else {
                toast.error(data.message || 'Erro ao processar solicitação.');
            }
        } catch (error) {
            toast.error('Erro de conexão ao tentar redefinir senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container signup-page">
            <div className="signup-box">
                <h1 className="text-uppercase-black signup-title" style={{fontSize: '1.5rem'}}>RECUPERAR SENHA</h1>
                <p style={{marginBottom: '20px', color: 'var(--text-muted)'}}>
                    Digite o e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                </p>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                    <button type="submit" className="btn-accent signup-button" disabled={isLoading}>
                        {isLoading ? 'ENVIANDO...' : 'ENVIAR LINK'}
                    </button>
                </form>
                <p className="signup-footer-text">
                    Lembrou a senha? <Link to="/login" className="signup-link">Voltar ao Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
