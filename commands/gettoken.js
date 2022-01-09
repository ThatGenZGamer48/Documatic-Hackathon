const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

// Gettoken command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gettoken")
        .setDescription(
            "Gets a token for you, if you have all the three vaccines!"
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

        // Get the inventory items of the user.
        const inventoryItems = userDetail["inventoryItems"];

        // Check if the user has all the three vaccines.
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

        // Remove the three vaccines from the user's inventory.
        for (vaccine in data["vaccine_data"]) {
            const value = data["vaccine_data"][vaccine];

            indexOfVaccine = inventoryItems.indexOf(value["name"]);

            console.log(indexOfVaccine);

            if (indexOfVaccine > -1) {
                await inventoryItems.splice(indexOfVaccine, 1);
                console.log(inventoryItems[indexOfVaccine]);
            }
        }

        // Add the token to the user's inventory.
        await inventoryItems.push("Vaccine Researcher Token");

        // Update the user's inventory.
        await UserDetails.update(
            {
                inventoryItems: inventoryItems,
            },
            {
                where: {
                    userId: interaction.user.id,
                },
            }
        );

        // Send the reply.
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
