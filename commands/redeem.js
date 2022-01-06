const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("redeem")
		.setDescription("Redeem a random number of coins"),
	async execute(interaction) {
		const interactionUserDetails = await UserDetails.findByPk(
			interaction.user.id
		);

		console.log(interactionUserDetails["latestRedeemedTime"]);

		await interaction.reply({ content: "." });
	},
};
