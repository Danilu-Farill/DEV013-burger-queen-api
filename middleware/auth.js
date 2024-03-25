/*
const jwt = require('jsonwebtoken');

// function validationToken(req, resp, next) {//FUNCIÓN DE VALIDACIÓN DE 
//   try {
//       const { authorization } = req.headers;
//       if(!authorization) {//si no existe
//           return resp.status(401).send(); 
//       }
//       const token = authorization.split(" ")[1];
//       jwt.verify(token,"secret_key", function(err, user){
//           if(err) {
//               return resp.status(403).send("token invalido");
//           } if(user.role !== "admin") {
//               return resp.status(403).send("acceso denegado");
//           }
//           req.user = user;
//           next();
//       });
//   } catch (error) {
//       resp.status(401).send("No tienes autorización")
//   }
// };

module.exports = (secret) => (req, resp, next) => {
  try{
  const { authorization } = req.headers;
  console.log("🚀 ~ authorization:", authorization)
  if (!authorization) {
    //return resp.status(401).send("acceso denegado hduhuhushuhus")
    return next(403);
  }
  const [type, token] = authorization.split(' ')[1];
  console.log("🚀 ~ type, token:", type, token)
  if (type.toLowerCase() !== 'bearer') {//REVISAR DONDE ACOMADARLO
    return next();
  }
  jwt.verify(token, secret, (err, decodedToken) => {
    console.log("🚀 ~ jwt.verify ~ err:", err)
    console.log("🚀 ~ jwt.verify ~ token:", token)
    console.log("🚀 ~ jwt.verify ~ secret:", secret)
    console.log("🚀 ~ jwt.verify ~ decodedToken:", decodedToken)
    if (err) {
      return resp.status(403).send("token invalido");
      //return next(403);
    }if(user.role !== "admin") {
        return resp.status(403).send("acceso denegado");
    };
    req.id = decodedToken  
    // TODO: Verify user identity using `decodeToken.uid` (ROLE ID)
    // verificar la identidad del usuario usando `decode Token.uid`
  });
} catch(err) {
  resp.status(401).send("No tienes autorización")
}
};

module.exports.isAuthenticated = (req) => (//ID AUTENTICADO
  // TODO: Decide based on the request information whether the user is authenticated
  //decidir en función de la información de la solicitud si el usuario está autenticado
  // if (token !== id) {
  //   return resp.send("")
    
  // }
  false

);

module.exports.isAdmin = (req) => (
  // TODO: Decide based on the request information whether the user is an admin
  //decidir en función de la información de la solicitud si el usuario es administrador
  false
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);

*/




const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => { 
  try {
    const { authorization } = req.headers;
    console.log("🚀 ~ authorization auth middleware:", authorization);
    
    if (!authorization) {
      return next();
    };
    const token = authorization.split(' ')[1];
    console.log("🚀 ~ type, token AUTH MIDDLEWARE:", token[0]);

    if (token[0].toLowerCase() !== 'bearer') {
      console.log("🚀 ~ token IF AUTH MIDDLEWARE:",  token[0]);
      return next();
    };
    jwt.verify(token, secret, (err, decodedToken) => {
      console.log("VERITY JWT jwt auth middleware");
      console.log(decodedToken, "decoded");
      if (err) {
        console.log("🚀 ~ jwt.verify ~ ERR MIDDLEWARE AUTH:", err);
        //return resp.status(403).send("token invalido");
        return next(403);
  // } if(decodedToken.role !== "admin") {        
  //   return resp.status(403).send("acceso denegado");
      };
      req.decoded = decodedToken;
      console.log(req.decoded, "req detoken AUTH MIDDLEWARE VERIFY");
      console.log("🚀 ~ jwt.verify ~ decodedToken:", decodedToken)
 next();
});
  } catch (error) {
    console.log("🚀 ~ error dentro del auth middleware:", error)
    resp.status(400).send("error de token");
  }
};
//  // TODO: Verify user identity using `decodeToken.uid`
 module.exports.isAuthenticated = (req) => {
  console.log("console desde isAuthenticated AUTH MIDDLEWARE, DELETE");
  //(!!req.decodedToken)
  // console.log("requer", req.headers.authorization);//regresa el token con el bearer
  console.log("requer decodedToken", req.role);//regresa undefined
  // console.log("requer decodedToken body", req.body);//objeto vacio
  // console.log(" decodedToken ", authorization);//objeto vacio
  const { authorization } = req.headers;
  console.log(authorization, "hola authori");
  if(authorization) {
    console.log("console desde el if isAuthenticated AUTH MIDDLEWARE");
    return true;
  } 
}
//(false)
//determinar si un usuario está autenticado. Esto significa que verifica si el token de autenticación (req.decodedToken) existe o no
  // TODO: Decide based on the request information whether the user is authenticated
module.exports.isAdmin = (req) => {
  console.log("console desde isAdmin AUTH MIDDLEWARE", req.token);
  const { authorization } = req.headers;
  console.log("🚀 ~ authorization ISADMIN DECODED:", req.decodedToken)//undefined
  console.log(authorization, "hola isAdmin");

  if(!authorization) {
    console.log("console desde el if isAdmin AUTH MIDDLEWARE");
    return false;
  // } if(req.decoded.role !== "admin") {
  } 
  // const decodedToken = decodeToken(authorization);
  //   console.log("🚀 ~ decodedToken:", decodedToken)
  //   return decodedToken.role === 'admin'; 
  //req.decodedToken && req.decodedToken.role === "admin"
};//{/*false!!req.decodedToken*/
//return (req.decodedToken.role =="admin")};
//si un usuario es un administrador
  // TODO: Decide based on the request information whether the user is an admin

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);



// const jwt = require('jsonwebtoken');






// module.exports = (secret) => (req, resp, next) => {
//   const { authorization } = req.headers;
//   console.log("🚀 ~ authorization:", authorization)

//   if (!authorization) {
//     return next();
//   }

//   const [type, token] = authorization.split(' ');

//   if (type.toLowerCase() !== 'bearer') {
//     return next();
//   }

//   jwt.verify(token, secret, (err, decodedToken) => {
//     if (err) {
//       return next(403);
//     }

//     // TODO: Verify user identity using `decodeToken.uid`
//   });
// };

// module.exports.isAuthenticated = (req) => (
//   // TODO: Decide based on the request information whether the user is authenticated
//   false
// );

// module.exports.isAdmin = (req) => (
//   // TODO: Decide based on the request information whether the user is an admin
//   false
// );

// module.exports.requireAuth = (req, resp, next) => (
//   (!module.exports.isAuthenticated(req))
//     ? next(401)
//     : next()
// );

// module.exports.requireAdmin = (req, resp, next) => (
//   // eslint-disable-next-line no-nested-ternary
//   (!module.exports.isAuthenticated(req))
//     ? next(401)
//     : (!module.exports.isAdmin(req))
//       ? next(403)
//       : next()
// );