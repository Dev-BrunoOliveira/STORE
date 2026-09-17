const { MercadoPagoConfig, Payment } = require('mercadopago');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const mpToken = process.env.MP_ACCESS_TOKEN;
  if (!mpToken) {
    return res.status(200).json({ message: 'Webhook ignorado: MP_ACCESS_TOKEN ausente.' });
  }

  try {
    const body = req.body || {};
    if (body.type === 'payment' && body.data && body.data.id) {
      const client = new MercadoPagoConfig({ accessToken: mpToken });
      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: body.data.id });

      const extRef = paymentInfo.external_reference || '';
      const status = paymentInfo.status;

      let dbStatus = 'pendente';
      if (status === 'approved') dbStatus = 'pago';
      else if (status === 'rejected' || status === 'cancelled') dbStatus = 'cancelado';

      if (extRef.includes('___')) {
        const [userId, orderId] = extRef.split('___');
        const dbUrl = `https://fila-max-default-rtdb.firebaseio.com/orders/${userId}/${orderId}.json`;
        
        await fetch(dbUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: dbStatus,
            paymentId: body.data.id,
            updatedAt: Date.now(),
          }),
        });
        console.log(`[Vercel Webhook] Pedido ${userId}/${orderId} atualizado para ${dbStatus}`);
      }
    }
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no Vercel Webhook:', error);
    return res.status(200).send('OK');
  }
};
