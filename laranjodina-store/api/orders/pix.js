const { MercadoPagoConfig, Payment } = require('mercadopago');

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
    const payment = new Payment(client);

    const { payer, totalAmount, orderId, userId } = req.body;

    const extRef = (userId && orderId) ? `${userId}___${orderId}` : (orderId || 'order_guest');

    const body = {
      transaction_amount: Number(totalAmount),
      description: 'Compra Loja Laranjodina',
      payment_method_id: 'pix',
      external_reference: extRef,
      payer: {
        email: payer.email,
        first_name: payer.name ? payer.name.split(' ')[0] : 'Cliente',
        last_name: payer.name ? (payer.name.split(' ').slice(1).join(' ') || 'Laranjodina') : 'Laranjodina',
        identification: payer.cpf ? {
          type: 'CPF',
          number: payer.cpf.replace(/\D/g, '')
        } : undefined
      }
    };

    const response = await payment.create({ body });

    return res.status(200).json({
      paymentId: response.id,
      total: response.transaction_amount,
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error) {
    console.error('Erro ao gerar PIX no Mercado Pago:', error);
    return res.status(500).json({ message: error.message || 'Erro ao comunicar com Mercado Pago.' });
  }
};
