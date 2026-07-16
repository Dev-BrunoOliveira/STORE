import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword: password })
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message || 'Senha atualizada com sucesso!');
                navigate('/login');
            } else {
                toast.error(data.message || 'Link inválido ou expirado.');
            }
        } catch (error) {
            toast.error('Erro de conexão ao tentar atualizar senha.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!email || !token) {
        return (
            <div className="container signup-page">
                <div className="signup-box">
                    <h1 className="text-uppercase-black signup-title" style={{color: 'red'}}>Link Inválido</h1>
                    <p>O link de recuperação está incompleto. Solicite um novo na página de recuperação.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container signup-page">
            <div className="signup-box">
                <h1 className="text-uppercase-black signup-title" style={{fontSize: '1.5rem'}}>NOVA SENHA</h1>
                <p style={{marginBottom: '20px', color: 'var(--text-muted)'}}>
                    Defina sua nova senha de acesso (mínimo 6 caracteres).
                </p>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Nova Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                    <input
                        type="password"
                        placeholder="Confirmar Nova Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                    <button type="submit" className="btn-accent signup-button" disabled={isLoading}>
                        {isLoading ? 'ATUALIZANDO...' : 'REDEFINIR SENHA'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
