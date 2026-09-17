import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../config/firebase';
import { confirmPasswordReset } from 'firebase/auth';
import { API_BASE } from '../config/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Suporta tanto oobCode (padrão Firebase Auth) quanto token/email da API
    const oobCode = searchParams.get('oobCode') || searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        if (!oobCode) {
            toast.error('Código de redefinição ausente.');
            return;
        }

        setIsLoading(true);

        try {
            // Tenta redefinir via Firebase Auth primeiro
            await confirmPasswordReset(auth, oobCode, password);
            toast.success('Senha redefinida com sucesso! Faça login com a nova senha.');
            navigate('/login');
        } catch (fbErr: any) {
            console.warn('Tentando redefinição via API alternativa...', fbErr);
            // Fallback para API Express caso o código seja da API legada
            if (email && oobCode) {
                try {
                    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, token: oobCode, newPassword: password })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        toast.success(data.message || 'Senha atualizada com sucesso!');
                        navigate('/login');
                        return;
                    }
                } catch {
                    // Ignora fallback e cai na mensagem de erro do Firebase
                }
            }

            let msg = 'Link de redefinição inválido ou expirado.';
            if (fbErr.code === 'auth/expired-action-code') {
                msg = 'O link de redefinição expirou. Solicite um novo.';
            } else if (fbErr.code === 'auth/invalid-action-code') {
                msg = 'Código de redefinição inválido.';
            }
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!oobCode) {
        return (
            <div className="container signup-page">
                <div className="signup-box">
                    <h1 className="text-uppercase-black signup-title" style={{color: '#ff4444'}}>Link Inválido</h1>
                    <p>O link de recuperação de senha está incompleto ou é inválido. Por favor, solicite um novo link.</p>
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

