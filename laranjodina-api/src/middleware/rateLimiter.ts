import rateLimit from 'express-rate-limit';

// Bloqueia brute force em login/signup: 10 tentativas por 15 minutos por IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.' },
  skipSuccessfulRequests: true, // não conta requisições bem-sucedidas
});

// Bloqueia spam em pedidos: 20 pedidos por hora por IP
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Limite de pedidos atingido. Tente novamente mais tarde.' },
});

// Rate limit geral da API: 200 req/min por IP
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições. Tente novamente em instantes.' },
});
