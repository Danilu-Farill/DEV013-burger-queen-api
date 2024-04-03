const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const { connect } = require('../connect');
const { ObjectId } = require('mongodb');

const { secret } = config;

module.exports = (app, nextMain) => {
  async function collectDataUser() {
    const db = await connect();
    return db.collection('users');
  };
  async function comparePassword(passwordPlain, hashPassword ) {
    const comparePassword = await bcrypt.compare(passwordPlain, hashPassword)
    return comparePassword;
  };

  app.post('/login', async (req, resp, next) => {
    try {
      const { password, email } = req.body;
      if(!email || !password){
        return resp.status(400).send("email o password incorrecto");
       };
      const userCollection = await collectDataUser();
      const user = await userCollection.findOne({email});
      if (!user) {
        return resp.status(404).send("incorrecto");
      }       
      if(!user.password){
        return resp.status(400).send("incorrecto");
      }
      if(!user.email) {
        return resp.status(400).send("email incorrecto");
      };
      
      const isValidPasword = await comparePassword(password, user.password);     
      if(!isValidPasword){
          return resp.status(400).send("false");
      } 
      
      const { _id, role } = user;
      const token = jwt.sign({role: role,  _id: _id, email: email}, secret);
      return resp.status(200).json({token});
  } catch (error) {
    resp.status(424).send("Error no estas poniendo los campos requeridos");        
  }

  });
  return nextMain();
};