const { getProducts, postProducts, putProducts, deleteProducts, getProductsId } = require('../controller/products');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

module.exports = (app, nextMain) => {

  app.get('/products', getProducts);

  app.get('/products/:name', /*requireAuth,*/ getProductsId);

  app.post('/products', postProducts);

  app.put('/products/:name', putProducts);
  // app.put('/products/:name', requireAdmin, putProducts, (req, resp, next) => {
 // });

  app.delete('/products/:id', deleteProducts);

  nextMain();
};
