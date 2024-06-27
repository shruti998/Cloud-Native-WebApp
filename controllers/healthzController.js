const healthService= require('../service/service');
const db=require('../models/index')
const logger = new require('../middleware/logger')

// const mysql=require('mysql');
const sequelize = require('../database');

const checkPayload=(req,res,next)=>
{
    const payloadType=req.headers['content-type'];
    if(req.body.toString().trim()==''||payloadType)
    {
        return res.status(400).send();
    }
    next();
}
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
const onlyGetRequest=(req,res,next)=>
{
    if(req.method !== 'GET')
    {
    res.status(405).send();
    }
};

const checkDatabase= async (req,res,next)=>
{
   
        try{
           await db.sequelize.authenticate();
            console.log('Connection has been established successfully.');
            logger.debug("healthz is working as expected")
            res.status(200).send();
        }
            catch(error){
                console.error('Unable to connect to the database: ', error);
                logger.error(error)
                res.status(503).send();
            }
        
};



module.exports={
    checkPayload,
    setCacheControl,
   onlyGetRequest,

   blockQueryParam,checkDatabase


};