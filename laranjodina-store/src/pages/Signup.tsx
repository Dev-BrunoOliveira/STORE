import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set, serverTimestamp } from 'firebase/database';
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
            // 1. Criar usuário com Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
            const user = userCredential.user;

            // 2. Atualizar o nome do perfil no Firebase Auth
            await updateProfile(user, {
                displayName: formData.name.trim()
            });

            // 3. Salvar dados extras do perfil no Firebase Realtime Database
            const userObj = {
                id: user.uid,
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone ? formData.phone.trim() : null,
                address: null,
            };

            await set(ref(db, `users/${user.uid}`), {
                ...userObj,
                createdAt: serverTimestamp()
            });

            const token = await user.getIdToken();

            toast.success(`Bem-vindo à Laranjodina, ${formData.name.split(' ')[0]}! 🎉`);
            storeLogin(token, userObj);
            navigate('/');

        } catch (err: any) {
            console.error("Erro no cadastro com Firebase:", err);
            let msg = 'Erro ao tentar cadastrar.';
            if (err.code === 'auth/email-already-in-use') {
                msg = 'Este e-mail já está em uso por outra conta.';
            } else if (err.code === 'auth/invalid-email') {
                msg = 'E-mail inválido.';
            } else if (err.code === 'auth/weak-password') {
                msg = 'A senha é muito fraca.';
            } else if (err.code === 'auth/configuration-not-found') {
                msg = 'Ative o provedor E-mail/Senha no Firebase Console (Menu Authentication > Sign-in method).';
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