const { getOrders, postOrders, putOrders, deleteOrders, getOrderId } = require('../controller/orders');
const { requireAuth,} = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/orders', requireAuth, getOrders)
  app.get('/orders/:orderId', requireAuth, getOrderId,)
  app.post('/orders', requireAuth, postOrders);
  app.put('/orders/:orderId', requireAuth, putOrders)
  app.delete('orders/:orderId', requireAuth, deleteOrders)

  nextMain();
};