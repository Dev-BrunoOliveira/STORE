const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const mpToken = process.env.MP_ACCESS_TOKEN;
  if (!mpToken) {
    return res.status(500).json({ message: 'MP_ACCESS_TOKEN não configurado nas variáveis de ambiente da Vercel.' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: mpToken });
    const preference = new Preference(client);

    const { items, payer, orderId, userId } = req.body;

    const extRef = (userId && orderId) ? `${userId}___${orderId}` : (orderId || 'order_guest');

    const mpItems = items.map(item => ({
      title: `${item.name || 'Produto'} (${item.size || 'Unico'})`,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'BRL',
    }));

    const origin = req.headers.origin || 'https://laranjodina-store.vercel.app';

    const response = await preference.create({
      body: {
        external_reference: extRef,
        items: mpItems,
        payer: {
          name: payer.name,
          email: payer.email,
        },
        back_urls: {
          success: `${origin}/minha-conta`,
          failure: `${origin}/checkout`,
          pending: `${origin}/minha-conta`,
        },
        auto_return: 'approved',
      }
    });

    return res.status(200).json({
      id: response.id,
      initPoint: response.init_point || response.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao gerar Preferência no Mercado Pago:', error);
    return res.status(500).json({ message: error.message || 'Erro ao comunicar com Mercado Pago.' });
  }
};
