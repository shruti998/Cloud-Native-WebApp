const Sequelize= require('sequelize');
module.exports= (sequelize, DataTypes) =>{
  console.log("TEST1");

    const User = sequelize.define("User", {
        id:{
          
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        first_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name:{
            type: DataTypes.STRING
          
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
          
        },
        account_created: {
          type: DataTypes.DATE,
         
        },
        verified:
        {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        account_updated: {
          type: DataTypes.DATE,
          
        },

    },{
timestamps:false
    });

    console.log("TEST5");

return User;
 }



