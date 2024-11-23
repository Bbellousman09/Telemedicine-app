const { Sequelize, DataTypes } = require('sequelize');  // Keep this line  
require('dotenv').config();  

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {  
    host: process.env.DB_HOST,  
    dialect: 'mysql',  
});  

const User = sequelize.define('User', {  
    username: {  
        type: DataTypes.STRING,  
        allowNull: false,  
        unique: true,  
    },  
    password: {  
        type: DataTypes.STRING,  
        allowNull: false,  
    },  
});  

// Sync the model with the database  
(async () => {  
    await sequelize.sync();  
})();  

module.exports = User;