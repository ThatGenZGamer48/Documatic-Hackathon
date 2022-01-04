const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("The help command."),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTitle("Help")
			.setDescription(
				interaction.client.commands.map(cmd => `\`${cmd.data.name}\` - ${cmd.data.description}`).join("\n")
			)
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
	}
}