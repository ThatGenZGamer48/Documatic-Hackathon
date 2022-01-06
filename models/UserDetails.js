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
            allowNull: false,
        },
        coins: {
            type: DataTypes.BIGINT,
        },
        latestRedeemedTime: {
            type: DataTypes.DATE,
        },
    },
    { freezeTableName: true }
);

module.exports = UserDetails;
