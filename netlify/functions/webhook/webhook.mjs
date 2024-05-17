const axios = require('axios');
require('dotenv').config(); 
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const order = JSON.parse(event.body);

  // Lee las propiedades del carrito
  const receiptType = order.note_attributes.find(attr => attr.name === 'Receipt Type')?.value;

  // Prepara las etiquetas
  let tags = order.tags || '';
  if (receiptType === 'factura') {
    tags += ', Factura';
  } else if (receiptType === 'boleta') {
    tags += ', Boleta';
  }

  try {
    // Actualiza las etiquetas del pedido
    await axios({
        method: 'put',
        url: `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2024-04/orders/${order.id}.json`,
        headers: headers,
        data: {
          order: {
            id: order.id,
            tags: tags
          }
        }
      })
      .then(response => {
        console.log('Order tags updated:', response.data);
        res.status(200).send('Webhook received');
      })
  } catch (error) {
    console.error('Error updating order tags:', error);
    res.status(500).send('Error processing webhook');
  }
}