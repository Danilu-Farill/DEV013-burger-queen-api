const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => { 
  try {
    const { authorization } = req.headers;
    //console.log("🚀 ~ authorization auth middleware: línea 6", authorization);
    
    if (!authorization) {
      return next();
    };
    const [type, token] = authorization.split(' ');
    // console.log("🚀 ~ type, token AUTH MIDDLEWARE SPLIT línea 13:", token);

    if (type.toLowerCase() !== 'bearer') {
      return next();
    }; 
    jwt.verify(token, secret, (err, decodedToken) => {
      // console.log(decodedToken, "decoded línea 19");
      if (err) {
        return next(403);
    };
    req.uid = decodedToken._id;
    req.role = decodedToken.role;
    req.email = decodedToken.email;
    // console.log("🚀 ~ jwt.verify ~ req.emai línea 25l:", req.email)

    //console.log("🚀 ~ jwt.verify ~ decodedToken o TOKEN ID: línea 26", req.uid, "DECODEDTOKEN", req.role)
 next();
});
  } catch (error) {
      resp.status(400).send("error de token");
    }
  };
 module.exports.isAuthenticated = (req) => {
  //(!!req.uid)
  if(req.uid) {
    // console.log("console desde el if isAuthenticated AUTH MIDDLEWARE línea 141", req.uid);
    return true;
  } else {
    return false;
  }
}
//(false)
//determinar si un usuario está autenticado. Esto significa que verifica si el token de autenticación (req.decodedToken) existe o no
  // TODO: Decide based on the request information whether the user is authenticated
module.exports.isAdmin = (req) => {
return req.role === "admin" ? true : false; 
  // if(req.role === "admin"){
  //   return true;
  // } else {
  //   return false;
  // }  
};

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