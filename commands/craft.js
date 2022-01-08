const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const vcData = require("../data.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("craft")
        .setDescription(
            "Crafts the vaccine for you, if you have the required ingredients"
        )
        .addStringOption((option) =>
            option
                .setName("vaccine")
                .setDescription("The vaccine to craft")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const userDetail = await UserDetails.findByPk(interaction.user.id);

        if (!userDetail) {
            return interaction.editReply({ content: "You haven't started a project yet! Use the /project start command to start a project!" });
        }

        const vaccine = interaction.options.getString("vaccine");

        const inventoryItems = userDetail["inventoryItems"];
        const coins = userDetail["coins"];

        const vaccineData = vcData["vaccine_data"];

        let listOfVaccineIds = [];

        for (object in vaccineData) {
            const value = vaccineData[object];

            listOfVaccineIds.push(value["id"]);
        }

        console.log(listOfVaccineIds);

        if (!listOfVaccineIds.includes(vaccine)) {
            await interaction.editReply({
                content: "That vaccine doesn't exist!",
            });
            return;
        }

        for (vaccineItem in vaccineData) {
            const vaccineItemValue = vaccineData[vaccineItem];

            if (vaccineItemValue["id"] == vaccine) {
                const vaccineName = vaccineItemValue["name"];
                const listOfIngredients = vaccineItemValue["ingredients"];

                // Have to check
                if (
                    !listOfIngredients.every((ingredient) =>
                        inventoryItems.includes(ingredient)
                    ) &&
                    !inventoryItems.includes(vaccineItemValue["virus"])
                ) {
                    await interaction.editReply({
                        content:
                            "You don't have the required ingredients and the virus!",
                    });
                    return;
                } else if (
                    !listOfIngredients.every((ingredient) =>
                        inventoryItems.includes(ingredient)
                    ) &&
                    inventoryItems.includes(vaccineItemValue["virus"])
                ) {
                    await interaction.editReply({
                        content:
                            "You don't have the required ingredients, but you do have the virus!",
                    });
                    return;
                } else if (
                    !inventoryItems.includes(vaccineItemValue["virus"]) &&
                    listOfIngredients.every((ingredient) =>
                        inventoryItems.includes(ingredient)
                    )
                ) {
                    await interaction.editReply({
                        content:
                            "You don't have the virus, but you do have the required ingredients!",
                    });
                    return;
                } else {
                    for (const ing of listOfIngredients) {
                        const indexOfIng = inventoryItems.indexOf(ing);
                        inventoryItems.splice(indexOfIng, 1);
                    }

                    const indexOfVirus = inventoryItems.indexOf(
                        vaccineItemValue["virus"]
                    );

                    inventoryItems.splice(indexOfVirus, 1);

                    inventoryItems.push(vaccineName);

                    const updatedCoins =
                        BigInt(coins) +
                        BigInt(vaccineItemValue["given_coins_when_crafted"]);

                    await UserDetails.update(
                        {
                            coins: updatedCoins,
                            inventoryItems: inventoryItems,
                        },
                        {
                            where: {
                                userId: interaction.user.id,
                            },
                        }
                    );

                    await interaction.editReply({
                        content: `You crafted the vaccine ${vaccineName} and got ${vaccineItemValue["given_coins_when_crafted"]}!`,
                    });
                }
            }
        }
    },
};
