const { MongoClient } = require('mongodb');
//const mongoose = require('mongoose');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;//se refiere al localhost de config.js


const client = new MongoClient(dbUrl);
const dbName = "Burguer_queen";

async function connect() {
  // TODO: Database Connection
  try {
    await client.connect();
    console.log('Connected successfully to server');
    //const db = client.db(dbName);//return
    return client.db(dbName);
  }
  catch(err) {
    console.log("error no conectado", err)

  }
}

module.exports = { connect };

