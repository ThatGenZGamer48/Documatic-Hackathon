const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Shows the list of items in your inventory"),
    async execute(interaction) {
        await interaction.deferReply();

        const userInventory = await UserDetails.findByPk(interaction.user.id);
        inventoryItems = userInventory["inventoryItems"];
        let refinedInventoryItems = [];
        for (const item of inventoryItems) {
            if (item == "Default") {
                //
            } else {
                await refinedInventoryItems.push(item);
            }
        }

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

        await interaction.editReply({ embeds: [embed] });
    },
};
