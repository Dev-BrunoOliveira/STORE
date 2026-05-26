// src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';

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
  const { name, email, password } = req.body;

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
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase(), hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, email: email.toLowerCase() }, secret, { expiresIn: '1d' });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: { id: result.insertId, name: name.trim(), email: email.toLowerCase() },
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

    return res.status(200).json({
      message: 'Login bem-sucedido.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error('Erro no login:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default authRouter;
