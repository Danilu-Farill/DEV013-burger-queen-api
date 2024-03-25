const { ObjectId } = require('mongodb');
const mongodb = require('mongodb');
const { connect } = require('./../connect');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

//const { create } = require('@hapi/joi/lib/ref');

async function collectDataUser() {
  const db = await connect();
  return db.collection('users');
};

module.exports = {
  getCreateUser: async (adminCreate) => {//hacer la petición
    try{
    const db = await collectDataUser();
    const {email, role } = adminCreate;
    const filter = {email: email, role: role};
    const result = await db.find(filter).toArray();
    if(!result.length) {
      return  await db.insertOne(adminCreate)
    }
    } catch(err) {
     console.log(err, "No existe la colección");
    }
  },
  getUsers: async (req, resp, next) => {//hacer la petición
    try{
      const {authorization} = req.headers;
    const db = await collectDataUser();
    if(!db) {
      return resp.status(400).send("La colección no existe")
    }
    if (!authorization) {//revisar cuando ya agregue el middleware
    return resp.status(401).send("No tienes permitido acceder a los usuarios");   
    };
    const result = await db.find({}).toArray();
    resp.status(201).send(result);
    } catch(err) {
      resp.status(400).send("No existe la colección");
    }
  },
  getUsersId: async (req, resp,) => {//mayor > menor >= mayor igual <=  menor igual
    try {
      const user = new ObjectId(req.params.id)
      console.log("🚀 ~ getUsersId: ~ user:", user.length)
      const db = await collectDataUser();
      if(!db) {
        return resp.status(404).send("Colección no encontrada")
      };
      if(req.params.id.length !== 24) {//revisar aquí el error no se queda aquí(req.params.id.length > 24
        return resp.status(404).send("revisa tu busqueda")
      }
      const result = await db.findOne(user);
      if(!result) {
        return resp.status(404).send("usuario no encontrado")
      } 
      resp.status(201).send(result);
      
    } catch (error) {
      resp.status(400).send("Intenta otro, user no encontrado en la colección");
    }
  },
  postRegister: async(req, resp, next) => {//AQUI SE REGISTRA EL USUARIO CON CAMPOS OBLIGATORIOS Y SI TODO SALE BIEN LA CONTRASEÑA SE ENCRIPTA (HASHEA) DENTRO DE LA BASE DE DATOS
    const schemaRegister = Joi.object({
      name: Joi.string().min(4).max(20).required(),
      role: Joi.string().min(4).max(20).required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}}), //.regex(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,18}$')),
      repeat_password: Joi.ref('password')
  });
  
  const saltRounds = 10;
     try {
      const { /*password,*/ email, role, name } = req.body;
      //validar si email existe
      //const validateName = await db.findOne({name});//validar si nombre existe
      // const { authorization } = req.headers;
      const { error } = schemaRegister.validate(req.body);
      if(error) {//aquí son todos los campos requeridos
        return resp.status(404).send("Campos obligatorios: Name, Email, Password(debe contener mas de 8 caracteres), Role");
      };
      const salt = await bcrypt.genSalt(saltRounds);
      console.log("🚀 ~ postRegister:async ~ salt:", salt)
      const password = await bcrypt.hash(req.body.password, salt);
      console.log("🚀 ~ postRegister:async ~ password:", password)
      const db = await collectDataUser();
      if(!db) {
        return resp.status(404).send("la colección no se a encontrado")
      };
      const validateEmail = await db.findOne({email});
      if(validateEmail) {
        return resp.status(403).send("email en uso");
      //}//if(validateName) {
        //return resp.status(403).send("nombre de usuario en uso");
      // } if(password.length > 20) {
      //   return resp.status(422).send("contraseña no encriptada, no se puede procesar");
      } if (validateEmail ==="" || password=="") {
        return resp.status(400).send("No ingresaste tu correo o contraseña")
      }
      // if(!authorization) {
      //   return resp.status(401).send("No autentificado");
      // }
      const result = await db.insertOne({email, role, name, password});//AQUÍ MODIFICO QUE SE AGREGA A LA BASE DE DATOS
      resp.status(200).json({result});
    } catch(err) {
      console.log("error enpostregister", err);
      resp.status(403).send("Usuario no creado");
    } 
  }, 
  putUsers: async(req, resp, next) => {//hacer la petición Y ENCRIPTAMIENTO DE NUEVOS USUARIOS
    const userPut = new ObjectId(req.params.id);
    //const userId = new ObjectId(req.params.id).toString(); //NO ME FUNCIONA ASÍ
 
    console.log("🚀 ~ putUsers:async ~ userPut:", userPut.toString().length)
    //const id = req.decodedToken;
    try {
      const db = await collectDataUser();
      if(!db) {
        return resp.status(400).send("Coleción no existe")
      };
      if(userPut.toString().length >24 || userPut.toString().length < 24) {//REVISAR NO ME FUNCIONA DEBERIA MANDARME AQUI Y ME SALE ERROR DE CONSOLA EN NAVEGADOR POSTMAM
        return resp.status(400).send("Usuario no encontrado")
      };
        // if(!userPut) {
        //   return resp.status(403).send("Esta no es tu cuenta de usuario")
        // }
      // if(req.body.role !== "admin") {
      //   return resp.status(403).send("No puedes actualizar la cuenta")
      // };
      // if(userPut.equals(id)) {
      //   next();
      // }else {
      //   return resp.status(403).send("Esta no es tu cuenta de usuario")
      // }//si el id no corresponde
      const result = await db.updateOne({_id: userPut}, {$set: req.body});
      console.log("🚀 ~ putUsers:async ~ result:", result)
      resp.status(200).send(result);
    } catch(err) {
      console.log("🚀 ~ putUsers:async ~ err ERROR DENTRODE USER CONTROLLER:", err)
      resp.status(400).send("No se pudo actualizar");
    } 
  },
  deleteUsers: async (req, resp)=> {
    const deleteUser = new ObjectId(req.params.id);
    try {
      const db = await collectDataUser();
      if(!db) {
        return resp.status(404).send("la colección no se a encontrado")
      } if (!deleteUser) {//
        console.log("error enpostregister DELETE");
        return resp.status(404).send("No se encontro el usuario")
      }
      const result = await db.deleteOne({_id: deleteUser});
      console.log("🚀 ~ putUsers:async ~ result:", result)
      resp.status(200).send(result);
    } catch(err) {
      resp.status(400).send("No se pudo eliminar");
    } 
  },
};





// async function encrypt(textPlain) {
//   const salt = await bcrypt.genSalt(saltRounds);
//   const saltHash = await bcrypt.hash(textPlain, salt);
//   return saltHash;
// }

// async function compare(passwordPlain, hashPassword ) {
//   const comparePassword = await bcrypt.compare(passwordPlain, hashPassword)//promise que devuelve boolean, 1er parametro la contraseña, 2parametro contraseña encriptada
//   return comparePassword;
// };






// postLogin: async(req, resp, next) => {///hacer la petición Y ENCRIPTAMIENTO DE NUEVOS USUARIOS
  //   try {
  //     const { password, email, role } = req.body;
  //     const db = await collectDataUser();
  //     const hashPassword = await db.findOne({email, role});
  //     const compareHash = await compare(password, hashPassword.saltHash); 
  //     console.log("🚀 ~ postLogin:async ~ compareHash:", compareHash)
  //   resp.status(200).json({compareHash});
  //   } catch(err) {
  //     resp.status(400).send("Usuario no guardado");
  //   } 
  // },
  // postUsers: async(req, resp, next) => {///hacer la petición Y ENCRIPTAMIENTO DE NUEVOS USUARIOS
  //   try {
  //     //const body = req.body;
  //     const db = await collectDataUser();
  //     const result = await db.insertOne(req.body);
  //     resp.status(200).send(result);
  //   } catch(err) {
  //     resp.status(400).send("Usuario no guardado");
  //   } 
  // },