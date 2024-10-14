const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    // const db = new Sequelize(process.env.DB_URL, {
    dialect: process.env.DB_DIALECT,
    dialectOptions: { // for reading
        // useUTC: false,
        timezone: "+08:00",
        // ssl: {
        //     require: true, // This will help you. But you will see new error
        //     rejectUnauthorized: false // This line will fix new error
        // },
    },
    timezone: "+08:00", // for writing
    define: {
        timestamps: false,
        underscored: true
    }
});

module.exports = db;