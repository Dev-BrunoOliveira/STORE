import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email.trim());
            toast.success('E-mail enviado! Verifique sua caixa de entrada.');
        } catch (error: any) {
            console.error('Erro ao enviar e-mail de redefinição:', error);
            if (error.code === 'auth/user-not-found') {
                // Para segurança, mostramos a mesma mensagem
                toast.success('Se o e-mail existir, você receberá um link de recuperação.');
            } else {
                toast.error('Erro ao solicitar redefinição de senha.');
            }
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
