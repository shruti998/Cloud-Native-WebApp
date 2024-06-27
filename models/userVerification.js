const Sequelize= require('sequelize');
module.exports= (sequelize, DataTypes) =>{
  console.log("TEST99");

    const UserVerification = sequelize.define("UserVerification", {
        // id:{
          
        //     allowNull: false,
        //     primaryKey: true,
        //     type: Sequelize.UUID,
        //     defaultValue: Sequelize.UUIDV4
        // },

        username:{
            type: DataTypes.STRING,
         
          
        },
        token: {
            type: DataTypes.UUID, 
            unique:true
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        link_clicked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        , 
         mail_sent: {
            type: DataTypes.DATE,
      
        },
        token_expiry: {
            type: DataTypes.DATE
          },
        

    },{
timestamps:false
    });

    console.log("TEST9");

return UserVerification;
 }



