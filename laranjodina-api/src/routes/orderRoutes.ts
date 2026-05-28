import { Router, Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { getProductBySlug } from '../catalog';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';

const orderRouter = Router();

interface OrderItem {
  slug: string;
  quantity: number;
  size: string;
}

interface Payer {
  name: string;
  email: string;
  cpf?: string;
}

interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

function getMpClient() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token || token === 'SEU_TOKEN_AQUI') {
    throw new Error('MP_ACCESS_TOKEN não configurado no .env');
  }
  return new MercadoPagoConfig({ accessToken: token });
}

function validateAndBuildItems(items: OrderItem[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Lista de itens inválida.');
  }
  return items.map(item => {
    const product = getProductBySlug(item.slug);
    if (!product) throw new Error(`Produto "${item.slug}" não encontrado.`);
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) throw new Error('Quantidade inválida.');
    if (!item.size) throw new Error('Tamanho obrigatório.');
    return { product, quantity: qty, size: item.size };
  });
}

function calcTotal(validatedItems: ReturnType<typeof validateAndBuildItems>): number {
  const raw = validatedItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return parseFloat(raw.toFixed(2));
}

function validateAddress(addr: ShippingAddress) {
  const cepClean = addr?.cep?.replace(/\D/g, '');
  if (!cepClean || cepClean.length !== 8) throw new Error('CEP inválido.');
  if (!addr.street?.trim()) throw new Error('Rua obrigatória.');
  if (!addr.number?.trim()) throw new Error('Número obrigatório.');
  if (!addr.city?.trim()) throw new Error('Cidade obrigatória.');
  if (!addr.state?.trim() || addr.state.trim().length !== 2) throw new Error('Estado inválido.');
}

function validatePayer(payer: Payer) {
  if (!payer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payer.email)) {
    throw new Error('E-mail inválido.');
  }
  if (!payer?.name?.trim()) throw new Error('Nome obrigatório.');
}

// POST /api/orders/pix — Cria pagamento PIX via Mercado Pago (requer login)
orderRouter.post('/pix', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, payer, shippingAddress } = req.body as {
      items: OrderItem[];
      payer: Payer;
      shippingAddress: ShippingAddress;
    };

    validatePayer(payer);
    validateAddress(shippingAddress);
    const validatedItems = validateAndBuildItems(items);
    const total = calcTotal(validatedItems);

    const client = getMpClient();
    const payment = new Payment(client);

    const nameParts = payer.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const result = await payment.create({
      body: {
        transaction_amount: total,
        payment_method_id: 'pix',
        payer: {
          email: payer.email,
          first_name: firstName,
          last_name: lastName,
          ...(payer.cpf && {
            identification: { type: 'CPF', number: payer.cpf.replace(/\D/g, '') },
          }),
        },
      },
    });

    const txData = result.point_of_interaction?.transaction_data;
    return res.json({
      paymentId: result.id,
      status: result.status,
      total,
      qrCode: txData?.qr_code,
      qrCodeBase64: txData?.qr_code_base64,
    });
  } catch (error: any) {
    console.error('Erro PIX:', error.message || error);
    const isConfig = error.message?.includes('MP_ACCESS_TOKEN');
    return res.status(isConfig ? 503 : 500).json({ message: error.message || 'Erro ao processar PIX.' });
  }
});

// POST /api/orders/preference — Cria preferência para Checkout Pro (requer login)
orderRouter.post('/preference', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, payer, shippingAddress } = req.body as {
      items: OrderItem[];
      payer: Payer;
      shippingAddress: ShippingAddress;
    };

    validatePayer(payer);
    validateAddress(shippingAddress);
    const validatedItems = validateAndBuildItems(items);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const client = getMpClient();
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: validatedItems.map(i => ({
          id: i.product.slug,
          title: `${i.product.name} (${i.size})`,
          quantity: i.quantity,
          unit_price: i.product.price,
          currency_id: 'BRL',
        })),
        payer: { name: payer.name, email: payer.email },
        back_urls: {
          success: `${frontendUrl}/pedido/sucesso`,
          failure: `${frontendUrl}/checkout`,
          pending: `${frontendUrl}/pedido/pendente`,
        },
        shipments: { cost: 0, mode: 'not_specified' },
      },
    });

    return res.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('Erro Preference:', error.message || error);
    const isConfig = error.message?.includes('MP_ACCESS_TOKEN');
    return res.status(isConfig ? 503 : 500).json({ message: error.message || 'Erro ao criar preferência.' });
  }
});

function verifyMpSignature(req: Request): boolean {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;
  // Se o segredo não estiver configurado, rejeita em produção; permite em dev
  if (!webhookSecret || webhookSecret === 'SEU_SEGREDO_WEBHOOK_AQUI') {
    return process.env.NODE_ENV !== 'production';
  }

  const xSignature = req.headers['x-signature'] as string | undefined;
  if (!xSignature) return false;

  const parts = Object.fromEntries(xSignature.split(',').map(p => p.split('=')));
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  const dataId = (req.body as any)?.data?.id ?? '';
  const manifest = `id:${dataId};request-date:${ts};`;

  const expected = createHmac('sha256', webhookSecret).update(manifest).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

// POST /api/orders/webhook — Notificações de pagamento do Mercado Pago
orderRouter.post('/webhook', (req: Request, res: Response) => {
  try {
    if (!verifyMpSignature(req)) {
      console.warn('[MP Webhook] assinatura inválida — requisição rejeitada');
      return res.sendStatus(401);
    }

    const body = req.body as { type?: string; data?: { id?: string } };
    if (body.type === 'payment' && body.data?.id) {
      console.log(`[MP Webhook] pagamento ID: ${body.data.id}`);
      // TODO: buscar pagamento na API do MP e atualizar pedido no banco
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro webhook:', error);
    res.sendStatus(200); // sempre 200 para o MP não retentar
  }
});

export default orderRouter;
