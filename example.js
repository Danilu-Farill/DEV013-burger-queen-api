//aqui la llamamos con asycn por ser promesa y debemos llamar la coleción
//app.get("/", async (req, res) => res.json({mensage: "conectado", sucess: true, code: 200}));

// app.post('/auth', async (req, res) => {
//   const db = await mongoConnect;
//   const collection = db.collection('auth');
//     const findResult = await collection.find({}).toArray();
//     res.json(findResult);
// });
//req.body
//res.status(200).json(user)
//res.status(200).json(success: true)
//cont http = require('http')
//const servidor = http.createServer((req, res) => {res.end()})



// app.post("/pedidos", async (req, res) => {
//   const data = req.body;
//   console.log("req.body", data);
  
//   res.json({mensage: "conectado", sucess:true, code: 200})
// });






// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Restauran', {
//   userNewUrlParse = true
// })
// .then((res) console.log(res, "conexión db"))
// .catch((err) console.error(err))




//aquí se establece la conexión con la base de datos
/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Ordersdb', {
  userNewUrlParse = true;
})//con esto me estoy conectando a mongo si es exitoso then si no es error
.then((res) console.log(res, "DB is connected"))
.catch((err) console.error(err))
*/