const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => { 
  try {
    const { authorization } = req.headers;
    
    if (!authorization) {
      return next();
    };
    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
      return next();
    }; 
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return next(403);
    };
    req.uid = decodedToken._id;
    req.role = decodedToken.role;
    req.email = decodedToken.email;
 next();
});
  } catch (error) {
      resp.status(400).send("error de token");
    }
  };
  
 module.exports.isAuthenticated = (req) => {
  if(req.uid) {
    return true;
  } else {
    return false;
  }
};

module.exports.isAdmin = (req) => {
return req.role === "admin" ? true : false;  
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