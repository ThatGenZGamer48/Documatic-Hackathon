const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("About the bot."),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTitle("About the bot")
			.setDescription("This bot was made for the hackathon hosted by the Documatic team. It focuses on a minigame regarding the development of COVID-19 vaccines.")
			.setColor("BLUE")
			.setAuthor({
				name: interaction.user.tag, 
				iconURL: interaction.user.avatarURL({ dynamic: true })
			})
			.setFooter({
				text: interaction.client.user.tag, 
				iconURL: interaction.client.user.avatarURL()
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

