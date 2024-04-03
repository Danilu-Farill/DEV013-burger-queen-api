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
next();
};

module.exports = (app, next) => {

  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAuth, getUsersId);

  app.post('/users', requireAdmin, postRegister);

  app.put('/users/:uid', requireAuth,  putUsers);

  app.delete('/users/:uid', requireAuth, deleteUsers);

  initAdminUser(app, next);
};