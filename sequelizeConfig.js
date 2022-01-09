const { Sequelize } = require("sequelize");
const { config } = require("dotenv");

config();

const sequelize = new Sequelize(
    `${process.env.POSTGRES_FULL_URL}`
);

module.exports = sequelize;
