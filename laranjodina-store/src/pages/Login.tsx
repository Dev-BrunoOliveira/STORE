import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { useAuthStore } from '../components/store/authStore';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const storeLogin = useAuthStore((s) => s.login);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

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
            const userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
            const firebaseUser = userCredential.user;
            const token = await firebaseUser.getIdToken();

            const userEmail = (firebaseUser.email || formData.email.trim()).toLowerCase();
            let userObj = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Usuário',
                email: userEmail,
                phone: null as string | null,
                address: null as string | null,
                isAdmin: userEmail.includes('brunooliver') || userEmail.includes('admin'),
            };

            try {
                const snapshot = await get(ref(db, `users/${firebaseUser.uid}`));
                if (snapshot.exists()) {
                    const dbData = snapshot.val();
                    userObj = {
                        ...userObj,
                        name: dbData.name || userObj.name,
                        phone: dbData.phone || null,
                        address: dbData.address || null,
                        isAdmin: Boolean(dbData.isAdmin || userObj.isAdmin),
                    };
                }
            } catch (dbErr) {
                console.warn('Erro ao carregar perfil do DB:', dbErr);
            }

            toast.success(`Bem-vindo de volta, ${userObj.name.split(' ')[0]}! 🤘`);
            storeLogin(token, userObj);
            navigate('/');

        } catch (err: any) {
            console.error("Erro no login com Firebase:", err);
            let msg = 'Credenciais inválidas ou erro ao entrar.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                msg = 'E-mail ou senha incorretos.';
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
            }
            setError(msg);
            toast.error(msg);
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

                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem'}}>
                    <p className="signup-footer-text" style={{marginTop: 0}}>
                        Não tem conta? <Link to="/cadastro" className="signup-link">Crie uma</Link>
                    </p>
                    <p className="signup-footer-text" style={{marginTop: 0}}>
                        <Link to="/esqueci-minha-senha" style={{color: 'var(--text-muted)', textDecoration: 'underline'}}>Esqueci minha senha</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;