const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

// Shop command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View the list of items available in the shop"),
    async execute(interaction) {
        // Make an embed to send the list of items in the shop
        const embed = new MessageEmbed()
            .setTitle("Shop")
            .setDescription("The list of items in the shop\n\n")
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

        // List the items in the shop.
        for (const key in data["shop"]["ingredients"]) {
            const value = data["shop"]["ingredients"][key];
            embed.description += `**${value["id"]}**. ${item} - ${value["coins"]} coins\n`;
        }

        // Send the embed.
        await interaction.reply({ embeds: [embed] });
    },
};
