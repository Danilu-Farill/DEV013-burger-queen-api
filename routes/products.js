const { getProducts, postProducts, putProducts, deleteProducts, getProductsId } = require('../controller/products');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

module.exports = (app, nextMain) => {

  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getProductsId);

  app.post('/products', requireAdmin, postProducts);

  app.put('/products/:productId', requireAdmin, putProducts);

  app.delete('/products/:productId', requireAdmin, deleteProducts);

  nextMain();
};
