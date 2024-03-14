exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb://localhost:27017';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';


/*
Ejemplo de conexión usando MongoDB Node Driver
npm install mongodb@6.5


const { MongoClient } = require('mongodb');
const config = require("./config");

const client = new MongoClient(config.dbUrl);

async function connect() {
  try {
    await client.connect();
    const db = client.db(<NOMBRE_DB>); // Reemplaza <NOMBRE_DB> por el nombre del db
    return db;
  } catch (error) {
    //
  }
}
*/