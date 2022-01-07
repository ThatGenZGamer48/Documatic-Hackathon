const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shop")
		.setDescription("View the list of items available in the shop"),
	async execute(interaction) {

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

		for (const [key, value] of Object.entries(data["shop"]["ingredients"])) {
			embed.description += `${key} - ${value} coins\n`;
		}

		await interaction.reply({ embeds: [embed] });
	}
};