const mongodb = require('mongodb');
const {ObjectId} = require('./../node_modules/mongodb');
const { connect } = require('./../connect');

async function collectData() {
  const db = await connect();
  return db.collection('orders');
};

async function collectDataProducts() {
  const db = await connect();
  return db.collection('products');
}
let nameOrders = //ESTRUCTURA DE EJEMPLO
  {
    "userId": 8888,
    "client": "Marina Díaz",
    "products": [
      {
        "qty":18,
        "product": {
          "id": 8246,
          "name": "Helado de chocolate",
          "price": 20,
          "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
          "type": "Postro",
          "dateEntry": "2022-03-05 15:14:10"
        }
      }
    ],
    "status": "pending",
    "dateEntry": "2022-03-05 15:14:10"
  };

module.exports = {
    getOrders: async (req, resp, next) => {//hacer la petición
      try{
       // if() {}//FALTA ERROR 401 NO HAY TOKEN, NO AUTORIZADO
      const data = await collectData();
      
      const findResult = await data.find({}).toArray();
      resp.status(200).send(findResult);
      }
      catch(err) {
        resp.status(404).send("No se encontraron usuarios")
      }
    },
    getOrderId: async (req, resp, next) => {//hacer la petición
      //let id = req.params.client;//
      let reqId = new mongodb.ObjectId(req.params.id);
      try {
        // if() {}//FALTA ERROR 401 NO HAY TOKEN, NO AUTORIZADO
        const db = await collectData();
        const findResult = await db.findOne(reqId);//me devuelve el 1
        // const findResult = await db.findOne({client: req.params.client});//cualquiera de los dos funciona
        console.log(findResult, "findResult");
        resp.status(200).send(findResult);
      } catch (error) {
        console.log("🚀 ~ getOrderId: ~ error:", error)
        resp.status(404).send("usario no encontrado");        
      }
    },
    postOrders: async (req, resp, next) => {
      try {
        const db = await collectData();
        // const dbProducts = await collectDataProducts();
        //await model.findByIdAndUpdate(id, { $push: { 'storage': storageDataUpdateStorage } })//enivamos un nuevo objeto en el documento en base a la ruta storage

        // console.log("🚀 ~ postOrders: ~ dbProducts:", dbProducts)
        // switch (req.body.name) {
        //   case null:
        //     resp.status(400).send("Cliente y precio no indicado")
        //     break;
        //   default:
        //     break;
        // }
        const client = req.body?.client;
        console.log("🚀 ~ postOrders: ~ client:", client)
        const price = req.body?.price;
        const promiseCollection = await db.insertOne(req.body);
        
        if(!client || !price) {
          console.log("nada");
          return resp.status(400).send("Cliente o Precio no indicado");
       } //else if(!resp){//aquí va la contraseña del token
      //   resp.status(401).send("Cliente no autenticado")
      //  }else if(resp !== roleAdmis) {
      //   resp.status(403).send("No tienes acceso no eres administrador")
      //}
        resp.status(201).send(promiseCollection);//también funciona, CUAL ES LA DIFERENCIA
      } catch (error) {
        console.log("error en el postOrders", error);
        return resp.status(422).send( "Usuario no posteado");
      }

      // const body = req.body.nameOrders;
      // const orders = new MongoOrders(connect());
      // try {
      //   const dataBase = orders.db();
      //   const ordersData = dataBase.collection("orders");
      //   const result = await ordersData.insertOne(nameOrders);
      //   console.log("🚀 ~ postOrders: ~ result:", result)
        // db.collection.insertOne(nameOrders);
        // resp.send();
        
      // } catch (error) {
        
      // }
      //resp.send(nameOrders);//aparece en postman pero no en la base de datos
      // let orders = new Orders();
      // orders.client = req.body.client;      
      // orders.products = req.body.products;
      // orders.products.product.price = req.body.products.product.price;
      // orders.products.product.image = req.body.products.product.image;
      // orders.products.product.type = req.body.products.product.type;
      // orders.date = req.body.dateEntry;
      // orders.save();

      // try {
      //   await orders.create(body);
      // } catch (error) {
      //   console.log("error del post", error);  
      // }

      // nameOrders.push({name: req.body.client});
      // resp.json(nameOrders);



      // const body = req.body;
      // console.log(body);

      
      // resp.status(201).json(data);
    },
    putOrders: async (req, resp, next) => {
      try {
        const client = req.params.client;
        //COMPROBAR ERROR 401 if there is no authentication header
        const db = await collectData();
        // let {client, name, price, type} = req.body//destructuración para obtener todo lo que mandamos por el body
        // console.log("destructuración");
        // const findResult = await db.updateOne({client}, {$set: id});
        //console.log({$set: req.body}, "set: req.body");//esto si pone lo que actualizo
        //console.log("client: req.params.client", {client: req.params.client});//AQUÍ LLEGA EL ID QUE PONGO
        // const findResult = await db.findOne({client: req.params.client}, {$set: req.body});
        // console.log("client: req.params.client", {_id: req.params});
        //const findResult = await db.updateOne({_id: new ObjectId(req.params.id)}, {set: req.body});..

        const existingClient = await db.findOne({client});
        if(!existingClient) {
          console.log("put hdhh");
          return resp.status(404).send("Cliente no existe");
        }
        const findResult = await db.updateOne({client}, {$set: req.body});//aparece por nombre(localhost:8080/orders/Ana Sofia)
        resp.status(200).send(findResult);
      } catch (error) {
        resp.status(400).send("No se pudo actualizar la data");
      }
      //findOneAndUpdate()
    },
    deleteOrders: async (req, resp, next) => {
      try{
      const db = await collectData();
      //const findResult = await collection.remove({"_id":'65f7c8b3d33c7c31c3ca158a'});
      //const findResult = await collection.deleteOne({"_id": ObjectId('65f7c8b3d33c7c31c3ca158a')});
      let reqId = new mongodb.ObjectId(req.params.id);
      const existingId = await db.findOne({_id: reqId});
     //falta if 401,  
      if(!existingId) {//if(!req.params.id)
        return resp.status(404).send("La orden indicada no existe");
      }
      const findResult = await db.deleteOne({_id: reqId});
      resp.status(200).send(findResult);
    } catch(err) {
      resp.status(400).send("Fallo al intentar eliminar");
    }
    }
  };



















/* ESTE ES EL CÓDIGO QUE HICE SIN REQ



//const {connect} = require("../connect");
//const orders = require('../routes/orders');
// const { ObjectId } = require('mongodb');
const { connect } = require('./../connect');
//const mongoConnect = require("./../connect");
let nameOrders = 
  {
    "userId": 5678,
    "client": "Denis Ramirez",
    "products": [
      {
        "qty":6,
        "product": {
          "id": 1234,
          "name": "Hambuerguesa con papas",
          "price": 500,
          "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
          "type": "Comida",
          "dateEntry": "2022-03-05 15:14:10"
        }
      }
    ],
    "status": "pending",
    "dateEntry": "2022-03-05 15:14:10"
  };
  let nameOrdersTwo = {
    "userId": 91011,
    "client": "Daniela Bustamante",
    "products": [
      {
        "qty":8,
        "product": {
          "id": 6789,
          "name": "Chilaquiles",
          "price": 80,
          "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
          "type": "Desayuno",
          "dateEntry": "2024-03-17 20:14:10"
        }
      }
    ],
    "status": "pending",
    "dateEntry": "2024-03-17 20:00:00"
  };
  let nameOrdersThree = 
  {
    "userId": 8888,
    "client": "Teresa Gonzalez",
    "products": [
    {
      "name": "Pan con leche",
      "price": 40,
      "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
      "type": "Cena",
      }],
  };
  let nameOrdersFour = 
  {
    "userId": 8404,
    "client": "Emiliano Zapata",
    "products": [
    {
      "name": "chocolate caliente con pan",
      "price": 100,
      "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
      "type": "Cena",
      }],
  }
module.exports = {
    getOrders: async (req, resp, next) => {//hacer la petición
      // TODO: Implement the necessary function to fetch the `users` collection or table
      //const db = await mongoConnect;
      const db = await connect();
      //const db = await mongoConnect;
      const collection = db.collection('orders');
      const findResult = await collection.find({}).toArray();
      resp.json(findResult);
    },
    getOrderId: async (req, resp, next) => {//hacer la petición
      const db = await connect();
      const collection = db.collection('orderId');
      const findResult = await collection.find({}).toArray();
      resp.json(findResult);
    },
    postOrders: async (req, resp, next) => {
      try {
        const db = await connect();
        const collection = db.collection('order');
        const promiseCollection = await collection.insertOne(req.body);
        console.log("🚀 ~ postOrders: ~ promiseCollection:", promiseCollection)
        //const promiseCollection = await collection.insertOne(nameOrdersTwo);
        //const promiseCollection = await collection.insertMany([nameOrdersThree, nameOrdersFour]);//INSERTO DOS AL MISMO TIEMPO;
        // const body = req.body;
        //resp.send(collection);
        //resp.send(promiseCollection); así funciona
        resp.send(promiseCollection);//también funciona, CUAL ES LA DIFERENCIA
      } catch (error) {
        console.log("error en el postOrders", error);
        return resp.status(404).json({message: "no hay data para almacenar"});
      }

      // const body = req.body.nameOrders;
      // const orders = new MongoOrders(connect());
      // try {
      //   const dataBase = orders.db();
      //   const ordersData = dataBase.collection("orders");
      //   const result = await ordersData.insertOne(nameOrders);
      //   console.log("🚀 ~ postOrders: ~ result:", result)
        // db.collection.insertOne(nameOrders);
        // resp.send();
        
      // } catch (error) {
        
      // }
      //resp.send(nameOrders);//aparece en postman pero no en la base de datos
      // let orders = new Orders();
      // orders.client = req.body.client;      
      // orders.products = req.body.products;
      // orders.products.product.price = req.body.products.product.price;
      // orders.products.product.image = req.body.products.product.image;
      // orders.products.product.type = req.body.products.product.type;
      // orders.date = req.body.dateEntry;
      // orders.save();

      // try {
      //   await orders.create(body);
      // } catch (error) {
      //   console.log("error del post", error);  
      // }

      // nameOrders.push({name: req.body.client});
      // resp.json(nameOrders);



      // const body = req.body;
      // console.log(body);

      
      // resp.status(201).json(data);
    },
    putOrders: async (req, resp, next) => {
      try {
        const db = await connect();
        const collection = db.collection('orderId');
        const findResult = await collection.findOneAndUpdate({"client": "Teresa Gonzalez"}, {$set: {"client": "Teresa Casiano"}});
        resp.status(200).json(findResult);
      } catch (error) {
        console.log("error en el putOrders", error);
        return resp.status(404).json({message: "no hay nada para actualizar"});
        
      }
      //findOneAndUpdate()
    },
    deleteOrders: async (req, resp, next) => {
      const db = await connect();
      const collection = db.collection('orderId');
      //const findResult = await collection.remove({"_id":'65f7c8b3d33c7c31c3ca158a'});
      //const findResult = await collection.deleteOne({"_id": ObjectId('65f7c8b3d33c7c31c3ca158a')});
      const findResult = await collection.findOneAndDelete({"client": "Emiliano Zapata"});
      resp.json(findResult)
    //  console.log(req.body)
    //   resp.delete(nameOrders)

    }
  };













*/



























































/*

{
  "_id": {
    "$oid": "65f7c8b3d33c7c31c3ca158a"
  },
  "userId": 5555,
  "client": "Romeo",
  "products": [
    {
      "name": "helado",
      "price": 20,
      "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
      "type": "postre"
    }
  ]
}

*/


















































  /*
  
  router.post('/', async (req, res) => {
    const body = req.body
    console.log(body)
    try {
        const mascotaDB = new Mascota(body)
        await mascotaDB.save()
        res.redirect('/mascotas')
    } catch (error) {
        console.log('error', error)
    }
})
  */














// //const {connect} = require("../connect");
// const { connect } = require('./../connect');
// //const mongoConnect = require("./../connect");
// let nameOrders = [
//   {
//     "userId": 5678,
//     "client": "Denis Ramirez",
//     "products": [
//       {
//         "qty":6,
//         "product": {
//           "id": 1234,
//           "name": "Hambuerguesa con papas",
//           "price": 500,
//           "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg",
//           "type": "Comida",
//           "dateEntry": "2022-03-05 15:14:10"
//         }
//       }
//     ],
//     "status": "pending",
//     "dateEntry": "2022-03-05 15:14:10"
//   }
// ];
// module.exports = {
//     getOrders: async (req, resp, next) => {//hacer la petición
//       // TODO: Implement the necessary function to fetch the `users` collection or table
//       //const db = await mongoConnect;
//       const db = await connect();
//       const collection = db.collection('orders');
//       const findResult = await collection.find({}).toArray();
//       resp.json(findResult);
//     },
//     postOrders: async (req, resp, next) => {
//       // const body = req.body.nameOrders;
//       console.log(req.body);
      
//       resp.send(nameOrders);//aparece en postman pero no en la base de datos
//       // let orders = new Orders();
//       // orders.client = req.body.client;      
//       // orders.products = req.body.products;
//       // orders.products.product.price = req.body.products.product.price;
//       // orders.products.product.image = req.body.products.product.image;
//       // orders.products.product.type = req.body.products.product.type;
//       // orders.date = req.body.dateEntry;
//       // orders.save();

//       // try {
//       //   await orders.create(body);
//       // } catch (error) {
//       //   console.log("error del post", error);  
//       // }

//       // nameOrders.push({name: req.body.client});
//       // resp.json(nameOrders);



//       // const body = req.body;
//       // console.log(body);

      
//       // resp.status(201).json(data);
//     },
//     // putOrders: async (req, resp, next) => {
//     //   const orderClient = req.body;
//     //   orderClient.body.client = "María Vega";
//     //   resp.send(nameOrders.orderClient)
//     //}
//     // deleteOrders: async (req, resp, next) => {
//     //  console.log(req.body)
//     //   resp.delete(nameOrders)

//     // }
//   };
//   /*
  
//   router.post('/', async (req, res) => {
//     const body = req.body
//     console.log(body)
//     try {
//         const mascotaDB = new Mascota(body)
//         await mascotaDB.save()
//         res.redirect('/mascotas')
//     } catch (error) {
//         console.log('error', error)
//     }
// })
//   */