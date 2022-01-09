const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

// Vaccines command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vaccines")
        .setDescription("View the list of vaccines available in the shop"),
    async execute(interaction) {
        // Make an embed to send the list of vaccines in the shop
        const embed = new MessageEmbed()
            .setTitle("Vaccines")
            .setDescription("The list of vaccines in the shop\n\n")
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

        for (const key in data["vaccine_data"]) {
            const value = data["vaccine_data"][key];
            const vaccineName = value["name"];
            const vaccineId = value["id"];
            const vaccineVirus = value["virus"];
            const vaccineIngredients = value["ingredients"];

            const formattedVaccineIngredients = vaccineIngredients.join(", ");

            const embedDescriptionString = `ID: ${vaccineId}\nVirus Required: ${vaccineVirus}\nIngredients Required: ${vaccineIngredients}`;

            embed.addField(vaccineName, embedDescriptionString, false);
        }

        // Send the embed.
        await interaction.reply({ embeds: [embed] });
    },
};
