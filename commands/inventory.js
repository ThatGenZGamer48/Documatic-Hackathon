const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");

// Inventory command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Shows the list of items in your inventory"),
    async execute(interaction) {
        // Defers the reply as it may take some time to communicate to the database.
        await interaction.deferReply();

        // Find the inventory of the user using the user's discord id.
        const userInventory = await UserDetails.findByPk(interaction.user.id);

        if (!userInventory) {
            // Send this if the user does not exist in the database. (Hasn't started a project.)
            await interaction.editReply({
                content:
                    "You have to first start a project using the /project start command!",
            });
        } else {
            inventoryItems = userInventory["inventoryItems"];
            let refinedInventoryItems = [];
            // Do not show the "Default" item created. (It was created as arrays in PostgreSQL cannot be empty).
            for (const item of inventoryItems) {
                if (item == "Default") {
                    //
                } else {
                    await refinedInventoryItems.push(item);
                }
            }

            // Create the embed for sending the inventory and the coins.
            const embed = new MessageEmbed()
                .setTitle(`Inventory`)
                .addFields(
                    { name: "Coins", value: String(userInventory["coins"]) },
                    { name: "Items", value: refinedInventoryItems.join("\n") }
                )
                .setColor("BLUE")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setFooter({
                    text: interaction.client.user.tag,
                    iconURL: interaction.client.user.avatarURL(),
                })
                .setTimestamp();

            // Reply with the inventory embed.
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
