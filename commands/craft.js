const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("craft")
        .setDescription("Crafts the vaccine for you, if you have the required ingredients")
        .addStringOption(option =>
			option
				.setName("vaccine")
				.setDescription("The vaccine to craft")
				.setRequired(true)
			),
	async execute(interaction) {
        await interaction.deferReply();

		const userDetail = await UserDetails.findByPk(interaction.user.id);
		const vaccine = interaction.options.getString("vaccine");
		// const ingredients = data['vaccine_data'][vaccine]['ingredients'];

        // You can index "inventoryItems" (array), "coins": (bigint)
		const userItems = userDetail["inventoryItems"];
		const coins = userDetail["coins"];

        const vaccineToCraft = interaction.options.getString("vaccine");

        let listOfVaccines = [];

        for (const [key, value] of Object.entries(data["vaccine_data"])) {
            listOfVaccines.push(value["id"]);
        }

        if (!listOfVaccines.includes(vaccineToCraft)) {
            await interaction.editReply({
                content: "You have passed an improper vaccine ID."
            });
            return;
        }

        // for (const [key, value] of Object.entries(data["vaccine_data"])) {
            
		// }

        for (const vd of data["vaccine_data"]) {
            if (data["vaccine_data"][vd]["id"] == vaccineToCraft) {
                //
            }
        }
	}
}