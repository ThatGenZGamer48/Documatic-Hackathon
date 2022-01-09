const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/userDetails");
const data = require("../data.json");

// Tokens command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tokens")
        .setDescription(
            'Get the number of "Vaccine Researcher Tokens" you have'
        ),
    async execute(interaction) {
        // Defer the reply as it may take a while to communicate to the database.
        await interaction.deferReply();

        // Get the user's details.
        const userDetail = await UserDetails.findByPk(interaction.user.id);

        // Check if the user has not started the game yet.
        if (!userDetail) {
            return interaction.editReply({
                content:
                    "You haven't started a project yet! Use the /project start command to start a project!",
            });
        }

        // Count the number of "Vaccine Researcher Token"s the user has.
        const counts = {};
        const array = userDetail["inventoryItems"];
        array.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });

        const numberOfTokens = counts["Vaccine Researcher Token"];

        // Make an embed to send the number of tokens the user has.
        const embed = new MessageEmbed()
            .setTitle("Vaccine Researcher Tokens")
            .setDescription(
                `You have ${numberOfTokens} Vaccine Researcher Tokens`
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

        // Send the embed.
        await interaction.editReply({ embeds: [embed] });
    },
};
