const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeConfig.js");

const UserDetails = sequelize.define(
    "UserDetails",
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        inventoryItems: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        coins: {
            type: DataTypes.BIGINT,
        },
        latestRedeemedTime: {
            type: DataTypes.DATE,
            allowNull: true,
            primaryKey: false,
        },
    },
    { freezeTableName: true }
);

module.exports = UserDetails;
