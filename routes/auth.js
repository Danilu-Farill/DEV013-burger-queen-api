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
    //console.log("🚀 ~ comparePassword auth routes ~ hashPassword AUTH ROUTES:", hashPassword)
    const comparePassword = await bcrypt.compare(passwordPlain, hashPassword)
    return comparePassword;
  };
  
  app.post('/login', async (req, resp, next) => {
    // const { email, password } = req.body;
    // if (!email || !password) {
    //   return next(400);
    try {
      const userId = new ObjectId(req._id).toString();
      // console.log("🚀 ~ app.post ~ userId:", userId);
      // if(!userId) {//VERIFICAR QUE EL ID EXISTA???
      //   return resp.status(401).send("No regitrado");
      // };
      const { password, email } = req.body;
      const userCollection = await collectDataUser();
      if(!userCollection) {//no me sirve, ni forzando un error
        return resp.status(404).send("No se encontro la colección");
      };
       const user = await userCollection.findOne({email});
       console.log("🚀 ~ app.post ~ user AUTH ROUTES:", user);

       if(!user) {
        console.log("registro402 ngdygdtdtdtdfrdrdr");
          return resp.status(401).send("email incorrecto");
      };

      const isValidPasword = await comparePassword(password, user.password);
      if(!isValidPasword){//funciona bien
          return resp.status(401).send("Contraseña incorrecta");
      } if(user.role !== "admin") {//????
        console.log("registro403 ngdygdtdtdtdfrdrdr");
          return resp.status(401).send("No tienes acceso de admin");//lo puedo quitar
      }if (isValidPasword) {//si compare es true va a crear un token
        //const token = jwt.sign({role: req.body.role,  _id: new ObjectId(req._id)}, "secret_key");
        //const token = jwt.sign({role: req.body.role,  userId}, "secret_key");
        const token = jwt.sign({role: req.body.role,  userId}, secret);
        console.log("🚀 ~ app.post auth routes  ~ token:", token);
        return resp.status(200).json(token);
      };
  } catch (error) {
    //resp.headers.text = error.message;
    console.log("error 400 catch", error);
    resp.status(400).send("Error no estas poniendo los campos requeridos")        
  }
    //next();
    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT
//    next();
  });
//FALTA EL ID, PERO TERMINADO
//CORREGIR QUE SOLO SEA OBLIGATORIO DOS CAMPOS O NO?????
  return nextMain();
};
