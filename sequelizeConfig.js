const { Sequelize } = require("sequelize");
const { config } = require("dotenv");

config();

const sequelize = new Sequelize(
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST_NAME}:${process.env.POSTGRES_HOST_PORT}/${process.env.POSTGRES_DATABASE_NAME}`
);

module.exports = sequelize;
