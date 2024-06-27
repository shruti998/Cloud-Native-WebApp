
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../database');

//onst env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/../config/config.json')[env];

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./user.js') (sequelize, Sequelize);
db.UserVerifications = require('./userVerification.js') (sequelize, Sequelize);

db.sequelize.authenticate()
.then(() => {
  console.log("Connected to DB");
  return db.sequelize.sync({force: false});
})
.then(async () => {
  console.log("Adding users to DB");
  
})
.catch((err) => {
  console.log("Error", err);
})

module.exports = db;





