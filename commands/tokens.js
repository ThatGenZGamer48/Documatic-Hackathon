const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/userDetails");
const data = require("../data.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tokens")
        .setDescription("Get the number of \"Vaccine Crafter Tokens\" you have"),
    async execute(interaction) {
        await interaction.deferReply();

        const userDetail = await UserDetails.findByPk(interaction.user.id);

        if (!userDetail) {
            return interaction.editReply({ content: "You haven't started a project yet! Use the /project start command to start a project!" });
        }

        const counts = {};
        const array = userDetail["inventoryItems"];
        array.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1 
        });

        const numberOfTokens = counts["Vaccine Crafter Token"];

        const embed = new MessageEmbed()
            .setTitle("Vaccine Crafter Tokens")
            .setDescription(`You have ${numberOfTokens} Vaccine Crafter Tokens`)
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
    }

}