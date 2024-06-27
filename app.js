const express= require('express');
const bodyParser=require('body-parser');
const heathRoutes= require('./routes/routes');

const logger = new require('./middleware/logger')
// Load environment variables from .env file
require('dotenv').config();


const app=express();
//const port=8080;
const port=process.env.PORT;

app.use(bodyParser.json());

app.use('/',heathRoutes);
app.listen(port,()=>{
    console.log('Server is running on port: ',port);
    logger.info('Server is running on port {port}');


});
const db = require('./models');
// db.sequelize.sync({alter:true}).then(()=>{
//     console.log("Database Created");
// });S

db.sequelize.authenticate()
.then(() => {
  console.log("Connected to DB ");
  logger.info("Connected to DataBase")
  logger.debug("Sequelize Connected")

  return db.sequelize.sync({force: false});
})
.then(async () => {
  console.log("Adding users to DB");
  
  logger.info("Adding users to GCP Database")
 
db.Users = require('./models/user.js') (db.sequelize, db.Sequelize);
db.UserVerifications = require('./models/userVerification.js') (db.sequelize, db.Sequelize);

})
.catch((err) => {
  console.log("Error", err);
  logger.error(err)
})
//

module.exports = app;