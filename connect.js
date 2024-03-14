const {MongoOrder} = require('mongodb');
const mongoose = require('mongoose');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;//se refiere al localhost de config.js

const order = new MongoOrder(config.dbUrl)

// async function connect() {
//   // TODO: Database Connection
//   try {
//     await order.connect();
//     const db = order.db();
//     return db;
//   }
//   catch(err) {

//   }
// }
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Restauran', {
  userNewUrlParse = true
})
.then((res) console.log(res, "conexión db"))
.catch((err) console.error(err))

module.exports = { connect };

//aquí se establece la conexión con la base de datos
/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Ordersdb', {
  userNewUrlParse = true;
})//con esto me estoy conectando a mongo si es exitoso then si no es error
.then((res) console.log(res, "DB is connected"))
.catch((err) console.error(err))
*/