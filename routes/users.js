const bcrypt = require('bcrypt');

const {requireAuth, requireAdmin,} = require('../middleware/auth');

const { getUsers, getUsersId, putUsers, deleteUsers, postRegister, getCreateUser } = require('../controller/users');


const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    role: "admin",
  };

  getCreateUser(adminUser);
// if(adminUser === false) {//agregarlo dentro de la colección de 
//   console.log("🚀 ~ initAdminUser ~ addAdminUser:")
//   const collectionUser = await collectDataUser()
//   const addAdminUser = collectionUser.insertOne({adminUser});
//   return addAdminUser;
// }

next();
};
/*
// if(!adminUser.role || adminUser.role === null || adminUser.role === "") {
//   console.log("role por defecto");
//  adminUser.role = "admin"; 
// }
*/
/*
if(adminUser.role = "admin"){
  return true;
} else {
  return "admin";
} */

/*
 * Español:
 *
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

module.exports = (app, next) => {

  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:id', /*requireAuth,*/ getUsersId);

  app.post('/register', /*requireAdmin,*/ postRegister);

  app.put('/users/:id',  putUsers);

  app.delete('/users/:id', requireAuth, deleteUsers);

  initAdminUser(app, next);
};
