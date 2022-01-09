const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/userDetails");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveitemtest")
        .setDescription("Test command for giving items"),
    async execute(interaction) {
        const user = await UserDetails.findByPk(interaction.user.id);

        /* const userCoins = user["coins"];

        updatedCoins = BigInt(userCoins) + BigInt(1000); */

        const userInventoryItems = user["inventoryItems"];

        /* userInventoryItems.push("Smallpox Vaccine");
        userInventoryItems.push("Influenza Vaccine"); */
        userInventoryItems.push("Coronavirus Vaccine");

        await UserDetails.update(
            {
                inventoryItems: userInventoryItems,
            },
            {
                where: {
                    userId: interaction.user.id,
                },
            }
        );
    },
};
