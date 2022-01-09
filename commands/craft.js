const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const vcData = require("../data.json");

// Craft command.

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

        // Get the vaccine to craft.
        const vaccine = interaction.options.getString("vaccine");

        // Get the inventory items of the user.
        const inventoryItems = userDetail["inventoryItems"];
        // Get the number of coins the user has.
        const coins = userDetail["coins"];

        // Get the vaccine data.
        const vaccineData = vcData["vaccine_data"];

        // Get the vaccine IDs using a for loop.
        let listOfVaccineIds = [];

        for (object in vaccineData) {
            const value = vaccineData[object];

            listOfVaccineIds.push(value["id"]);
        }

        console.log(listOfVaccineIds);

        // Check if the vaccine is valid.
        if (!listOfVaccineIds.includes(vaccine)) {
            await interaction.editReply({
                content: "That vaccine doesn't exist!",
            });
            return;
        }

        for (vaccineItem in vaccineData) {
            // Get the vaccine details.
            const vaccineItemValue = vaccineData[vaccineItem];

            if (vaccineItemValue["id"] == vaccine) {
                // Get the vaccine name and ingredients required.
                const vaccineName = vaccineItemValue["name"];
                const listOfIngredients = vaccineItemValue["ingredients"];

                // Have to check if the user has the required ingredients.
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
                    // Get the list of ingredients required and remove it from the user's inventory.
                    for (const ing of listOfIngredients) {
                        const indexOfIng = inventoryItems.indexOf(ing);
                        inventoryItems.splice(indexOfIng, 1);
                    }

                    // Get the virus and remove it from the user's inventory.
                    const indexOfVirus = inventoryItems.indexOf(
                        vaccineItemValue["virus"]
                    );

                    inventoryItems.splice(indexOfVirus, 1);

                    // Update the user's details.
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

                    // Send the reply.
                    await interaction.editReply({
                        content: `You crafted the vaccine ${vaccineName} and got ${vaccineItemValue["given_coins_when_crafted"]}!`,
                    });
                }
            }
        }
    },
};
