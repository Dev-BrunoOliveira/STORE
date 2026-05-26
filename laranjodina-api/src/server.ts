import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { query } from './db';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import { globalLimiter, authLimiter, orderLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// Em dev com proxy local pode ser necessário; nunca ativar em produção
if (isDev) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// ── Security headers ───────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (Postman, mobile) apenas em dev
      if (!origin && isDev) return callback(null, true);
      if (origin && allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body parsing com limite de tamanho (evita DoS por payload gigante) ────────
app.use(express.json({ limit: '50kb' }));

// ── Rate limit global ─────────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Laranjodina API' });
});

// Produtos (público)
app.get('/api/produtos', async (_req: Request, res: Response) => {
  try {
    const produtos = (await query('SELECT * FROM produtos')) as any[];
    const formatados = produtos.map((p: any) => ({
      ...p,
      category: JSON.parse(p.category),
      sizes: JSON.parse(p.sizes),
      oldPrice: p.old_price,
      imageUrl: p.image_url,
    }));
    res.json(formatados);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno ao buscar produtos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
