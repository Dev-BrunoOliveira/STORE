// src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { db } from '../config/firebase';
import { ref, set, push, serverTimestamp } from 'firebase/database';

const authRouter = Router();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET não configurado ou muito fraco (mínimo 32 caracteres).');
  }
  return secret;
}

// Mínimo 8 chars, 1 maiúscula, 1 número
function validatePassword(password: string): string | null {
  if (typeof password !== 'string' || password.length < 8) return 'Senha deve ter no mínimo 8 caracteres.';
  if (!/[A-Z]/.test(password)) return 'Senha deve conter ao menos uma letra maiúscula.';
  if (!/[0-9]/.test(password)) return 'Senha deve conter ao menos um número.';
  return null;
}

// =============================
// ROTA DE CADASTRO /signup
// =============================
authRouter.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({ message: 'Nome inválido.' });
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'E-mail inválido.' });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const secret = getJwtSecret();

    const existing = await query<any[]>('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result: any = await query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), hashedPassword, phone ? phone.trim() : null]
    );

    try {
      await set(ref(db, `users/${result.insertId}`), {
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone ? phone.trim() : null,
        createdAt: serverTimestamp()
      });
    } catch (fbError) {
      console.error('Erro ao salvar usuário no Firebase:', fbError);
    }

    const token = jwt.sign({ id: result.insertId, email: email.toLowerCase() }, secret, { expiresIn: '1d' });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: { id: result.insertId, name: name.trim(), email: email.toLowerCase(), phone: phone ? phone.trim() : null, address: null },
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// =============================
// ROTA DE LOGIN /login
// =============================
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Dados inválidos.' });
  }

  try {
    const secret = getJwtSecret();

    const users = await query<any[]>('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    const user = users[0];

    // Sempre executa bcrypt para evitar timing attack (revela se email existe)
    const hashToCompare = user?.password ?? '$2b$12$invalidsaltthatisatleast22chars.invalidhashXXXXXXXXXXXXX';
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1d' });

    try {
      await push(ref(db, `login_events/${user.id}`), {
        email: user.email,
        timestamp: serverTimestamp()
      });
    } catch (fbError) {
      console.error('Erro ao registrar login no Firebase:', fbError);
    }

    return res.status(200).json({
      message: 'Login bem-sucedido.',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address },
    });
  } catch (error: any) {
    console.error('Erro no login:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// =============================
// ROTA DE ESQUECI A SENHA /forgot-password
// =============================
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'E-mail é obrigatório.' });

  try {
    const users = await query<any[]>('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (users.length === 0) {
      // Retorna sucesso igual para não vazar emails cadastrados
      return res.status(200).json({ message: 'Se o e-mail existir, você receberá um link de recuperação.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora
    
    await query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [token, expires, email.toLowerCase()]);

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email.toLowerCase()}`;
    
    // MOCK EMAIL SENDING
    console.log('\n\n======================================================');
    console.log('📧 MOCK EMAIL ENVIADO PARA:', email.toLowerCase());
    console.log('LINK DE RECUPERAÇÃO:', resetLink);
    console.log('======================================================\n\n');

    return res.status(200).json({ message: 'Se o e-mail existir, você receberá um link de recuperação.' });
  } catch (error) {
    console.error('Erro no forgot-password:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

// =============================
// ROTA DE RESET DE SENHA /reset-password
// =============================
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: 'Dados inválidos.' });
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const users = await query<any[]>('SELECT id, reset_token_expires FROM users WHERE email = ? AND reset_token = ?', [email.toLowerCase(), token]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    if (Date.now() > users[0].reset_token_expires) {
      return res.status(400).json({ message: 'O link de recuperação expirou. Solicite um novo.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?', [hashedPassword, email.toLowerCase()]);

    return res.status(200).json({ message: 'Senha atualizada com sucesso! Você já pode fazer login.' });
  } catch (error) {
    console.error('Erro no reset-password:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

// =============================
// ROTA DE ATUALIZAR PERFIL /profile
// =============================
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';

authRouter.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, phone, address } = req.body;
  const userId = req.user!.id;
  const userEmail = req.user!.email;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Nome inválido.' });
  }

  try {
    // Atualizar no MySQL
    await query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name.trim(), phone ? phone.trim() : null, address ? address.trim() : null, userId]
    );

    // Atualizar no Firebase
    try {
      await set(ref(db, `users/${userId}`), {
        name: name.trim(),
        email: userEmail,
        phone: phone ? phone.trim() : null,
        address: address ? address.trim() : null,
        updatedAt: serverTimestamp()
      });
    } catch (fbError) {
      console.error('Erro ao atualizar usuário no Firebase:', fbError);
    }

    return res.status(200).json({
      message: 'Perfil atualizado com sucesso!',
      user: { id: userId, name: name.trim(), email: userEmail, phone: phone?.trim() || null, address: address?.trim() || null },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error.message);
    return res.status(500).json({ message: 'Erro interno ao atualizar perfil.' });
  }
});

export default authRouter;
