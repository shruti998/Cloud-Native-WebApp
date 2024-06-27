const healthService= require('../service/service');
const db=require('../models/index.js')
const logger = new require('../middleware/logger')
// const mysql=require('mysql');
const sequelize = require('../database');
//const  db= require('../models');
const bcrypt=require('bcrypt');
const {body,validationResult} = require('express-validator')
const {PubSub} =require('@google-cloud/pubsub')
const pubSubGCP=new PubSub('cloudspring2024');
//const crypto = require('crypto');
const checkPayload=(req,res,next)=>
{
   const payloadType=req.headers['content-type'];
   if(req.body.toString().trim()==''||payloadType)
   {
       return res.status(400).send();
   }
   next();
}


const validateEmailAndPassword=[
   body('username').isEmail(),
   body('password').isLength({min:5})
]


const setCacheControl=(req,res,next)=>{
   res.setHeader('Cache-control','no-cache');
   next();


};
const blockQueryParam=(req,res,next)=>{
if(req.path === '/healthz' && Object.keys(req.query).length>0)
{
   return res.status(400).send(); 
}
   next();


};
const invalidEndpoint = async (req, res) => {
   res.setHeader('cache-control', 'no-cache');
   return res.status(404).send();


}
const checkDatabase= async (req,res,next)=>
{
 
       try{
          await db.sequelize.authenticate();
           console.log('Connection has been established successfully.');
          
           next();
       }
           catch(error){
               console.error('Unable to connect to the database: ', error);
               logger.error(error)
               res.status(503).send();
           }
      
};
const createUser= async (req,res)=>
{
   console.log("IN create user ");
   try{
   const{first_name,last_name,password,username}= req.body;
   const allowedFields=['first_name','last_name','password','username'];
   const notAllowedFields=[];
   for(const field in req.body)
{
 if(!allowedFields.includes(field))
 {
     notAllowedFields.push(field);
 }
}
if(notAllowedFields.length>0)
{
  return  res.status(400).send();  
}
   const errors=validationResult(req);
   if(!errors.isEmpty())
   {
       return res.status(400).send();
   }
 
   if(!first_name)
   {
       logger.warn("First Name can't be empty");
       return res.status(400).send();
   }
   if(!last_name)
   { logger.warn("Last Name can't be empty");
       return res.status(400).send();
   }
   if(!password)
   {logger.warn("Password can't be empty");
       return res.status(400).send();;
   }
   if(!username)
   {
       logger.warn("Email can't be empty");
       return res.status(400).send();;
   }
       const saltRounds=10;
       const hashPassword= await bcrypt.hash(password,saltRounds);
       console.log("hash password ",hashPassword);
       const alreadyUser=await db.Users.findOne({where:{username:username}});
console.log("alreadyUser ",alreadyUser);
       if(alreadyUser && alreadyUser.username)
       {
           console.log("alreadyUser if statement ");
           return res.status(400).end();
       }
       const user=await db.Users.create({
           first_name,last_name,
           password:hashPassword,
           username,
            account_created:new Date(),
           account_updated:new Date()


       });
       console.log("After User Created ",user.toJSON());
      
       const message={
           id:user.id,
           username:user.first_name,
           email:username
       };
       const data=Buffer.from(JSON.stringify(message));
       try{
           const mid= await pubSubGCP.topic('verify_email').publishMessage({data:data})
           console.log("messaged published",mid);


       }catch(err)
       {
           console.log("messaged not published"+err.message);
           //process.exit=1
       }
       //removing password from the returned object
       //Creating verifyemail data
       //const token=require('crypto').randomUUID();
       try {
           const userVerification = await db.UserVerifications.create({
               username: username,
              // token: token,
               mail_sent: new Date(),
               token_expiry: new Date(),
           });
           console.log("User verification created successfully:", userVerification);
           logger.info("User verification created successfully:")

       } catch (error) {
           console.error("Error creating user verification:", error);
           logger.debug("error in updating user table"+error)
           return res.status(405).send("Failed to create user verification");
       }
      // publishing message to pubsub topic
    


       const{ password:removedPassword,verified:removedVerified,...newUser}=user.toJSON();
       console.log("Date  ",user.account_created);
       logger.info("Checking the user is verified or")
     
           res.status(201).json(newUser);
     
    
      
   }
   catch(error)
   {
       logger.error(error)
    res.status(500).send();
   }
}
const getUserInfo= async (req,res)=>{
   console.log("hshhdh")
   try{
     
       // Extracting the user info
       const { id,first_name,last_name,username,account_created,account_updated}=req.auth;
       const user= { id,first_name,last_name,username,account_created,account_updated};
       if(user)
       {
         
           res.json(user);
       }
       else{
           res.status(404).send();
       }
   }catch(error)
   {
       logger.error(error)
res.status(500).send();
   }
}
const verifyEmail = async (req, res) => {


   console.log("In verifyUser")
   logger.info("user clicked the link")
   const { email, expirationTime ,token} = req.query;
   console.log("req query")
   console.log("req query"+ email)
   console.log("req query"+ expirationTime)
   logger.info("email for testing ${email}")


   const expTime=await db.Users.findOne({where:{username:email}});
   logger.info("email for testing "+expTime)


   const expirationTimeS = new Date(expTime).getTime() / 1000;
   //logger.info("email for testing "+expirationTimeS)
   const expirationTimestamp = parseInt(expirationTime, 10);
   //logger.info("email for testing expirationTimestamp"+expirationTimestamp)

   logger.debug("After creating expirationTimestamp")
   // Compare expiration time with current time
  
   const currentTimeStamp = Math.floor(Date.now() / 1000);
   if (currentTimeStamp > expirationTimestamp) {
       // Link has expired
       console.log("In verifyUser currenbt time exceed")
       logger.info("In verifyUser current time exceed")
       logger.debug("In verifyUser current time exceed")
       const updateUserTable = await db.Users.update({
           verified: false
       }, {
           where: {
               username: email,
           },
       });
       logger.debug("updating the user verification when the link is expired verified false")
       const updateUserVerificationTable = await db.UserVerifications.update({
           verified: false
       }, {
           where: {
               username: email,
           },
       });
  
       return res.send('Link Expired');
   } else {
      
       console.log("In verifyUser currenbt time  not exceed")
       logger.debug("In verifyUser currenbt not exceed")
   const updateUserVerificationTableVerified = await db.UserVerifications.update({
       verified: true
   }, {
       where: {
           username: email,
       },
   });


   const updateUserVerified = await db.Users.update({
       verified: true
   }, {
       where: {
           username: email,
       },
   });
           return res.send('Email Verified');
     
   }
};


const updateUserInfo= async(req,res)=>{
   try{  
       // Extracting the user info from the middleware
       const user=req.auth;


     // Extracting the request body data
     const {first_name,last_name,password}=req.body;
     const allowedFields=['first_name','last_name','password'];
     const notAllowedFields=[];
       logger.info("User Verified")
     for(const field in req.body)
{
   if(!allowedFields.includes(field))
   {
       notAllowedFields.push(field);
   }
}
if(notAllowedFields.length>0)
{
  return  res.status(400).send();  
}
if(Object.keys(req.body).length==0)
{
  return  res.status(400).send();  
}
if(password && password.length<5)
{
   return  res.status(400).send();
}
// Updating the user
const hashedPassword=password? await bcrypt.hash(password,10):req.auth.password;
     const updateUser=await db.Users.update({
       first_name: first_name|| req.auth.first_name,
       last_name:last_name|| req.auth.last_name,
       password:hashedPassword,
       account_updated:new Date()
     },{
       where:{username:req.auth.username}
     })


     logger.info("User Updated")
     res.status(204).send();


   }catch(error)
   {
       logger.error(error)
res.status(500).send();
   }


}




module.exports={


   setCacheControl,
   getUserInfo,
   validateEmailAndPassword,
   checkPayload,
   verifyEmail,


   invalidEndpoint,checkDatabase,
  createUser,
  updateUserInfo


};

