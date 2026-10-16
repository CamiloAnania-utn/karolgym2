const { Sequelize } = require("sequelize");
require("dotenv").config();
const isLocalHost = ["127.0.0.1", "localhost"].includes(process.env.DB_HOST || "127.0.0.1");
const useSSL = process.env.DB_SSL !== undefined ? process.env.DB_SSL.trim().toLowerCase() === "true" : !isLocalHost;
const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { host: process.env.DB_HOST || "127.0.0.1", port: process.env.DB_PORT || 5432, dialect: "postgres", logging: false, dialectOptions: useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {}, } );

module.exports = sequelize;