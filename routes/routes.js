const express=require('express');
const heathController= require('../controllers/healthzController');
const userController= require('../controllers/userController');
const {authentication} =require('../middleware/authentication');
// const mysql=require('mysql');
require('dotenv').config();


const sequelize = require('../database');
const router= express.Router();

router.use('/healthz',heathController.setCacheControl,(req,res,next)=>{
if(req.method != 'GET')
{
    res.status(405).send();
}
else{
    next();
}
}
);

router.get('/healthz',
heathController.checkPayload,
heathController.setCacheControl,
heathController.blockQueryParam,
heathController.checkDatabase,
 );
console.log("Hello controller");
// user Controller

router.use('/v1/user',(req,res,next)=>{
    if(req.method == 'GET'||req.method == 'POST'||req.method == 'PUT')
    {
       
        next();
    }
    else{
        res.status(405).send();  
    }
    }
    );
    router.route('/userVerify').get(userController.verifyEmail);
 router.post('/v1/user',userController.validateEmailAndPassword,userController.checkDatabase,userController.createUser);

 router.get('/v1/user/self',authentication,userController.checkDatabase,userController.checkPayload,userController.getUserInfo);
  
 router.put('/v1/user/self',authentication,userController.checkDatabase,userController.updateUserInfo)
 router.route('/*')
    .all(userController.invalidEndpoint)


     

module.exports=router;