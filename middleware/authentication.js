const basicAuth= require('basic-authentication');
const db= require('../models');
const bcrypt=require('bcrypt');
const logger = new require('../middleware/logger')
const authentication= async (req,res,next)=>{
    console.log("In auth");
    // const header=req.headers['authorization'];
    // if(!header)
    // {
    //     return res.status(401).send();
    // }
    // const data=Buffer.from(header.split(' ')[1],'base64').toString().split(':');
    // const {username,password}=data;

    const header=req.headers.authorization.split(' ')[1];
    // if(!header)
    // {
    //     return res.status(401).send();
    // }
    const data=Buffer.from(header,'base64').toString('ascii')
    const[username, password] = data.split(':');
    // const {username,password}=data;

    console.log("username: " + username)
    try{
const user= await db.Users.findOne({where:{username:username}});
//const user2= await db.UserVerifications.findOne({where:{username:username}});

if(!user|| !(await bcrypt.compare(password,user.password))){
    return res.status(401).send();

}
// if(user2.verified!=true)
if(!user.verified)
{
    console.log("user is not verified")
    logger.info("User is not verified");
    return res.status(403).send(); 
}

console.log("Userrrrrr   ",user);
req.auth=user;
next();

    }catch(error)
    {
        console.log(error)
        return res.status(503).send();
    }

}
module.exports={authentication};