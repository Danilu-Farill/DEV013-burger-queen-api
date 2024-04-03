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





// //const mongodb = require("./../connect");

// // const mongoConnect = mongodb.connect();

// // const { getUsers } = require('../controller/users');
// // const getUser = getUsers();
// //const {getUsers} = require('./../controller/orders');

// //const orders = require('../controller/orders');
// const { getOrders } = require('../controller/orders');
// const { requireAuth,} = require('../middleware/auth');

// //const mongodb = require("./../connect");

// // const mongoConnect = mongodb.connect();

// // const { getUsers } = require('../controller/users');
// // const getUser = getUsers();
// //const {getUsers} = require('./../controller/orders');

// //const orders = require('../controller/orders');
// const { getOrders } = require('../controller/orders');
// const { requireAuth,} = require('../middleware/auth');

// module.exports = (app, nextMain) => {
//   app.get('/orders', getOrders)
// //     const mongoConnect = mongodb;
// //     const collection = mongoConnect.collection('orders');
// //     const response = await collection.getOrders();
// //     resp.json(response)
// //     //resp.json();
// //     // next.getOrders().then((data) => {
// //     //   resp.json(data[0])})
// //     //const res = await getUsers(resp);
// // //resp.send(getUsers);
// //     //req.params.orders;
// //     //resp.json(getUsers);
// //   //   const db = await mongoConnect;
// //   //   const collection = db.collection('orders');
// //   //   const findResult = await collection.find({}).toArray();
// //   //   resp.json(findResult);
  
// //   });
//   // app.get('/orders/:orderId', requireAuth, (req, resp, next) => {
//   // });

//   // app.post('/orders', requireAuth, (req, resp, next) => {
//   // });

//   // app.put('/orders/:orderId', requireAuth, (req, resp, next) => {
//   // });

//   // app.delete('/orders/:orderId', requireAuth, (req, resp, next) => {
//   // });

//   nextMain();
// };

