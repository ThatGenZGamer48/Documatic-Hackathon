const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gettoken")
        .setDescription(
            "Gets a token for you, if you have all the three vaccines!"
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const userDetail = await UserDetails.findByPk(interaction.user.id);

        if (!userDetail) {
            return interaction.editReply({ content: "You haven't started a project yet! Use the /project start command to start a project!" });
        }

        const inventoryItems = userDetail["inventoryItems"];

        console.log(inventoryItems);

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
        
        for (vaccine in data["vaccine_data"]) {
            const value = data["vaccine_data"][vaccine];

            indexOfVaccine = inventoryItems.indexOf(value["name"]);

            console.log(indexOfVaccine);

            if (indexOfVaccine > -1) {
                await inventoryItems.splice(indexOfVaccine, 1);
                console.log(inventoryItems[indexOfVaccine]);
            }
        }

        await inventoryItems.push("Vaccine Crafter Token");

        console.log(inventoryItems);

        await UserDetails.update({
            inventoryItems: inventoryItems,
        }, {
            where: {
                userId: interaction.user.id,
            }
        });

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
