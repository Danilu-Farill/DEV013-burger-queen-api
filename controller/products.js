const { ObjectId } = require('mongodb');
//const mongodb = require('mongodb');
const { connect } = require('./../connect');

async function collectDataProducts() {
  const db = await connect();
  return db.collection('products');
};

const collectionProducts = 
  {
    "id": 8884,
    "name": "Coctel frutal",
    "price": 40,
    "image": "https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/coffe.jpg",
    "type": "Desayuno",
    "dateEntry": "2024-03-05 15:14:10"
  };

module.exports = {
    getProducts: async (req, resp, next) => {//hacer la petición
      try {
       const { authorization } = req.headers;
       console.log(authorization, "PRODUCTS");
       if(!authorization) {
        return resp.status(403).send("No autorizado");
       }
      const db = await collectDataProducts();
      const findResult = await db.find({}).toArray();
      resp.status(200).send(findResult);
    } catch(err) {
        resp.status(400).send("No existe la colección");
      }
    },
    getProductsId: async (req, resp,) => {
      const {name} = req.params;
      try {
        const db = await collectDataProducts();
        const findResult = await db.findOne({name});
        resp.status(200).send(findResult);
        
      } catch (error) {
        resp.status(400).send("Intenta otro, product no encontrado en la colección");
      }
    },
    postProducts: async (req, resp, next) => {//hacer la petición
      try {
        const body = req.body;
        const db = await collectDataProducts();
        const findResult = await db.insertOne(body);
        resp.status(200).send(findResult);
      } catch (error) {
        resp.status(400).send("Producto no guardado");
      }
    },
    putProducts: async (req, resp, next) => {//CHECAR NO LO ESTA HACIENDO
      try {
        let name = req.params.name;
        console.log("🚀 ~ putProducts: ~ nameBody:", name)
        //let {name, type} = req.body;
        const db = await collectDataProducts();
        const findResult = await db.updateOne({name}, {$set: req.body});
        resp.status(200).send(findResult);
      } catch (error) {
        resp.status(400).send("No se actualizo la data");
      }
    },
    deleteProducts: async (req, resp, next) => {//hacer la petición
      try {
        let bodyId = new ObjectId(req.params.id)
        console.log("🚀 ~ deleteProducts: ~ bodyId:", bodyId)
        const db = await collectDataProducts();
        const findResult = await db.deleteOne({_id: bodyId});
        resp.status(200).send(findResult);
      } catch (error) {
        resp.status(400).send("Producto sin existencia");
      }
    },
  };