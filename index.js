const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');//validar si recibe un token, si hay autentificación
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');//investigar
const {connect} = require("./connect");
//const connectDB = require("./connect");
const cors = require("cors");
 
const { port, secret } = config;
const app = express();//inicializar express

//vamos a ejecutar y llamar mongodb, regresa una promesa
//settings(configuraciones)
app.set('config', config);
app.set('pkg', pkg);
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));
//connectDB.connect().then(() => {});
connect();

// app.get('/orders', async (req, res) => {
//   const db = await mongoConnect;
//   const collection = db.collection('orders');
//     const findResult = await collection.find({}).toArray();
//     res.json(findResult);
// });

//app.post()

// app.get('/products', async (req, res) => {
//   const db = await mongoConnect;
//   const collection = db.collection('products');
//     const findResult = await collection.find({}).toArray();
//     res.json(findResult);
// });

// app.get('/users', async (req, res) => {
//   const db = await mongoConnect;
//   const collection = db.collection('users');
//     const findResult = await collection.find({}).toArray();
//     res.json(findResult);
// })


// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  //start the server
  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
