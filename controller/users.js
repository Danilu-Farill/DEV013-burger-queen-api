const { ObjectId } = require('mongodb');
const mongodb = require('mongodb');
const { connect } = require('./../connect');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
//const { isAdmin } = require('./../middleware/auth')
//const { result } = require('@hapi/joi/lib/base');
//const { create } = require('@hapi/joi/lib/ref');

async function collectDataUser() {
  const db = await connect();
  return db.collection('users');
};
module.exports = {
  getCreateUser: async (adminCreate) => {
    try{
    const db = await collectDataUser();
    const {email, role } = adminCreate;
    const filter = {email: email, role: role};
    const result = await db.find(filter).toArray();
    if(!result.length) {
      return  await db.insertOne(adminCreate)
    };
    } catch(err) {
     console.log(err, "No existe la colección");
    }
  },
  getUsers: async (req, resp, next) => {
    try{
    let {page, limit} = req.query;
    limit = limit || 1;
    if(!page) {
        page = 1;
    };
    const skip = (page-1 ) * 10;
    const db = await collectDataUser();
    const users = await db.find().skip(skip).limit(limit).toArray();
    resp.status(200).json(users);
    } catch(err) {
      resp.status(444).send("Sin respuesta");
    }
  },
  getUsersId: async (req, resp,) => {
    try {
      const uid = req.params.uid;
      let findUser;
      if (ObjectId.isValid(uid)) {
        findUser = {_id: new ObjectId(uid)};
      } else {
        findUser = {email: uid};
      };
      const user = await collectDataUser();
      if(!findUser) {
        return resp.status(400).json("No valido")
      };
      const result = await user.findOne(findUser);
      if(result === null) {
        return resp.status(404).send("Correo no encontrado");
      } if(req.role !== "admin") {
          if(uid !== req.uid && uid !== req.email){
            return resp.status(403).json("No puedes acceder no eres admi");
          }
      };
      return resp.status(200).json(result);
    } catch (error) {
      resp.status(500).send("No encontrado");
    }
  },
  postRegister: async(req, resp, next) => {
  //   const schemaRegister = Joi.object({
  //     name: Joi.string().min(4).max(20).required(),
  //     role: Joi.string().min(4).max(20).required(),
  //     email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}}), //.regex(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/),
  //     password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,18}$')),
  //     repeat_password: Joi.ref('password')
  // });
  try {
    const regexEmail = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/;
    //const regexPassword = /^(?=.*[ ])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
    const saltRounds = 10;
    const {email, role, name, password } = req.body;
    if(!email && !password) {
      return resp.status(400).send("Faltan contraseña y correo electrónico"); 
    } if(!password){
      return resp.status(400).json("Falta constraseña"); 
    } if(!email) {
      return resp.status(400).json({message: "Falta email"});
    } if(!regexEmail.test(email)) {
      return resp.status(400).send( "Email invalido");
    }; 
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const db = await collectDataUser();
    const userEmail = await db.findOne({email});
    if(userEmail !== null) {
      return resp.status(403).json("email en uso");
    }if (password.length < 5) {
      return resp.status(400).send("password: mínimo 8 caracteres");
    };
      const result = await db.insertOne({email: email, role: role, name: name, password: passwordHash});
      resp.status(200).json({email, name, passwordHash, role});
    } catch(err) {
      resp.status(500).send("Usuario no creado");
    } 
  }, 
  putUsers: async(req, resp, next) => {
    try {
      const uid =  req.params.uid;
      const { password, name, role } = req.body;
      let passwordHash;
      if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const password2 = await bcrypt.hash(password, salt);
        passwordHash = password2;
      } 
      if(req.role !== "admin"){
        if(uid !== req.uid && uid !== req.email){
          return resp.status(403).send("no se eres admin y no es tu usuario")
        }
      };

      let userUpDate;
      if(ObjectId.isValid(uid)) {
        userUpDate = {_id: new ObjectId(uid)};
      } else {
        userUpDate = {email: uid}
      };

      const collectionUser = await collectDataUser();
      const findUser = await collectionUser.findOne(userUpDate);
      
      if(!findUser) {
         return resp.status(404).send("No existen datos")
      } if(Object.keys(req.body).length === 0) {
         return resp.status(400).send("No hay datos para actualizar")
      };
          
      const setUpDate = {};
      if(name !== undefined) {
        setUpDate.name = name;
      } if(passwordHash !== undefined) {
        setUpDate.password = passwordHash;
      } if(role !== undefined){
        setUpDate.role = role;
      }; 
      if(setUpDate.role) {
          if(role === "admin"){
          return resp.status(403).send("no se puede modificar el rol")}
      };

      const user = await collectionUser.updateOne(userUpDate, {$set: setUpDate});
      const updateUser = await collectionUser.findOne(userUpDate);    
      resp.status(200).send(updateUser);
    } catch(err) {
      resp.status(421).send("Solicitud mal dirigida");
    } 
  },
  deleteUsers: async (req, resp)=> {
    try {
      const uid = req.params.uid;
      let deleteUser;
      if(ObjectId.isValid(uid)) {
        deleteUser = {_id: new ObjectId(uid)};
      } else {
        deleteUser = {email: uid};
      };
      const db = await collectDataUser();
      const findUser = await db.findOne(deleteUser);
      const findUser2 = await db.find(req.uid);

      if(findUser === null) {
        return resp.status(404).send("No se encontro el usuario")
      }
      if(req.role !== "admin"){
        if(uid !== req.uid && uid !== req.email) {
        return resp.status(403).send("No eres propietario")
        }
      };
    
      const result = await db.deleteOne(deleteUser);
      resp.status(200).send(result);
    } catch(err) {
      resp.status(500).send("No se pudo eliminar");
    } 
  },
};