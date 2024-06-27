const chai= require('chai')
const chaiHttp=require('chai-http')
const app= require('../app.js');
const db= require('../models/index')
const expect=chai.expect

chai.use(chaiHttp);
describe('GET /healthz', () => {
  
    it('Should check status 200 for GET call', async () => {
        const response = await chai
            .request(app)
            .get('/healthz')
        expect(response).to.have.status(200);
    });
});
describe('Test 1 - Create an account, and using the GET call, validate account exists',()=>{
    let createUser;
    before(async()=>{
         // CREATING NEW USER
         const existingUser = await db.Users.findOne({ where: { username: "shruti123@gmail.com" } });
        
         // If the user exists, delete it
         if (existingUser) {
             await db.Users.destroy({ where: { username: "shruti123@gmail.com" } });
         }
       
        const newUser = {
            first_name:"Test",
            last_name:"Test",
            password:"12345",
            username:"shruti123@gmail.com"
           
        };
         // Making post request
         const creatUserResponse= await chai.request(app).post('/v1/user').send(newUser);
         console.log("User cr")
         
         await db.Users.update({ verified: true }, { where: { username: "shruti123@gmail.com" } });
         console.log("User verified!")
         // Validating the response
     
    expect(creatUserResponse).to.have.status(201);
    createUser=creatUserResponse.body
    })
    
    after(async()=>{
        // Deleating the user that created during testing
        if(createUser)
        {
            await db.Users.destroy({where:{id:createUser.id}});
        }
    })
    it('should validate the new created userit using GET',async()=>{
       
         
     // Making get request
const getUserResponse= await chai.request(app).get('/v1/user/self').auth('shruti123@gmail.com','12345');

     // validating response

expect(getUserResponse).to.have.status(200);
expect(getUserResponse.body).to.have.property('id');
expect(getUserResponse.body).to.have.property('first_name').eql('Test');
expect(getUserResponse.body).to.have.property('last_name').eql('Test');
expect(getUserResponse.body).to.have.property('username').eql('shruti123@gmail.com');
expect(getUserResponse.body).to.have.property('account_created');
expect(getUserResponse.body).to.have.property('account_updated');

    });
});
//
describe('Test 2 - Update the account and using the GET call, validate the account was updated',()=>{
    let createUser;
    before(async()=>{
         // CREATING NEW USER
         const existingUser = await db.Users.findOne({ where: { username: "shruti1234@gmail.com" } });
        
         // If the user exists, delete it
         if (existingUser) {
             await db.Users.destroy({ where: { username: "shruti1234@gmail.com" } });
         }
 
        const newUser = {
            first_name:"Test",
            last_name:"Test",
            password:"12345",
            username:"shruti1234@gmail.com"
           
        };
         // Making post request
         const creatUserResponse= await chai.request(app).post('/v1/user').send(newUser);
         console.log("User cr")
         
         await db.Users.update({ verified: true }, { where: { username: "shruti1234@gmail.com" } });
         console.log("User verified!")
         // Validating the response
       
    expect(creatUserResponse).to.have.status(201);


    createUser=creatUserResponse.body
    })
    
    after(async()=>{
        // Deleating the user that created during testing
        if(createUser)
        {
            await db.Users.destroy({where:{id:createUser.id}});
        }
    })
    it('should validate the new created userit using GET',async()=>{
      //Updating the user
const updatedUser = {
    first_name:"Update"
   
};
// Making PUT request
const userUpdateResponse= await chai.request(app).put('/v1/user/self').send(updatedUser).auth('shruti1234@gmail.com','12345');
 
// validating update response
expect(userUpdateResponse).to.have.status(204);

         
     // Making get request
const getUserResponse= await chai.request(app).get('/v1/user/self').auth('shruti1234@gmail.com','12345');

     // validating response
expect(getUserResponse).to.have.status(200);
expect(getUserResponse.body).to.have.property('id');
expect(getUserResponse.body).to.have.property('first_name').eql('Update');
expect(getUserResponse.body).to.have.property('last_name').eql('Test');
expect(getUserResponse.body).to.have.property('username').eql('shruti1234@gmail.com');
expect(getUserResponse.body).to.have.property('account_created');
expect(getUserResponse.body).to.have.property('account_updated');

    });
});
