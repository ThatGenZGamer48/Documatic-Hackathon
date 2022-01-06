const { config } = require("dotenv");

config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    `postgres://postgres:${process.env.POSTGRES_PASSWORD}@localhost:5432/DocumaticTest`
);

module.exports = sequelize;
