const { ObjectId } = require('mongodb');
//const mongodb = require('mongodb');
const { connect } = require('./../connect');
const { isAdmin, requireAuth } = require('../middleware/auth');

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
      const db = await collectDataProducts();
      const findResult = await db.find({}).toArray();
      resp.status(200).send(findResult);
    } catch(err) {
        resp.status(400).send("No existe la colección");
      }
    },
    getProductsId: async (req, resp,) => {
      try {
        const productId = req.params.productId;
        const db = await collectDataProducts();
        if(!ObjectId.isValid(productId)){
          return resp.status(404).json("no encontrado")
        }
        const productIdObject = new ObjectId(productId);
        const findResult = await db.findOne(productIdObject);
        resp.status(200).send(findResult);
      } catch (error) {
        resp.status(500).send("Intenta otro, product no encontrado en la colección");
      }
    },
    postProducts: async (req, resp, next) => {//hacer la petición
      try {
        const { name, price, type} = req.body;
        const db = await collectDataProducts();
        if(!name || !price || !type) {
          return resp.status(400).send("no encontrado");
        }
        const findResult = await db.insertOne({name: name, price: price, type: type});
        console.log("🚀 ~ postProducts: ~ findResult:", findResult)
        
        if(req.role !== "admin"){
          return resp.status(401).send("Denegado");
        }
        return resp.status(200).json({name, price, type});
      } catch (error) {
        resp.status(500).send("Producto no guardado");
      }
    },
    putProducts: async (req, resp, next) => {//CHECAR NO LO ESTA HACIENDO
      try {
        const productId = req.params.productId;
        if(!ObjectId.isValid(productId)) {
          return resp.status(404).json("no actualizado")
        }
        const { name, price, type } = req.body;
        const updateId = new ObjectId(productId);
        console.log("🚀 ~ putProducts: ~ updateId:", updateId)
        const db = await collectDataProducts();
        const findUpDate = await db.findOne(updateId);
        console.log("🚀 ~ putProducts: ~ findUpDate:", findUpDate)
        
        const findResult = await db.updateOne({updateId}, {$set: {name, price, type}});
        resp.status(200).send(name, price, type);
      } catch (error) {
        resp.status(424).send("No se actualizo la data");
      }
    },
    deleteProducts: async (req, resp, next) => {//hacer la petición
      try {
        const id = req.params.productId;
        if(!ObjectId.isValid(id)) {
          return resp.status(404).send("No se encuentra")
        };

        const bodyId = new ObjectId(id)
        const db = await collectDataProducts();
        const find = await db.findOne(bodyId);
       
        const findResult = await db.deleteOne({_id: find});
        // if(findResult.deletedCount === 0) {
        //   return resp.status(404).send("No se elimino")
        // }
        resp.status(200).send(find);
      } catch (error) {
        resp.status(424).send("Producto sin existencia");
      }
    },
  };