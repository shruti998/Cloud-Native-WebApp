const  Sequelize = require('sequelize');
// const mysql = require('mysql2/promise');
const mysql = require('mysql');

require('dotenv').config();
console.log("process.env.DB_USER",process.env.DB_USER);
console.log("process.env.DB_PASSWORD",process.env.DB_PASSWORD);
console.log("host: process.env.DB_HOST", process.env.DB_HOST);


   const host = process.env.DB_HOST
   const user = process.env.DB_USER
   const password = process.env.DB_PASSWORD
   const database = process.env.DATABASE
   const dialect = 'mysql'
  //  const { host, user, password, database, dialect } = process.env;
//const connection =  mysql.createConnection({ host, user, password });
 //connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);



 const sequelize = new Sequelize(database, user, password, { 
  host:host,
  dialect: dialect });


   module.exports= sequelize;