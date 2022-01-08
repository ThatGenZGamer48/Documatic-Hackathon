const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gettoken")
        .setDescription(
            "Gets a token for you, if you have all the three vaccines!"
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const userDetail = await UserDetails.findByPk(interaction.user.id);
        const inventoryItems = userDetail["inventoryItems"];

        if (
            (!inventoryItems.includes("Smallpox Vaccine") &&
                !inventoryItems.includes("Influenza Vaccine")) ||
            !inventoryItems.includes("Coronavirus Vaccine")
        ) {
            await interaction.editReply({
                content: "You don't have all the three vaccines!",
            });
            return;
        }

        const embed = new MessageEmbed()
            .setTitle("You have been given a token!")
            .setDescription(
                "You can use this token to flex to your friends and get on top of the leaderboard!"
            )
            .setColor("BLUE")
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
