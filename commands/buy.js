const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const shopData = require("../data.json");

// Buy command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item in the shop")
        .addIntegerOption((option) =>
            option
                .setName("itemid")
                .setDescription("The ID of the item to buy")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Defer the reply as it may take a while to communicate to the database.
        await interaction.deferReply();

        // Get the inputted item ID.
        const itemid = interaction.options.getInteger("itemid");
        // Get the ingredients from the shop data.
        const ingredients = shopData["shop"]["ingredients"];

        // Define the Ingredient IDs.
        const ingredientIds = [1, 2, 3, 4, 5, 6];

        // Check if the item ID is valid.
        if (!ingredientIds.includes(itemid)) {
            await interaction.editReply({ content: "Invalid item ID" });
            return;
        }

        // Get the user's details.
        const userDetail = await UserDetails.findByPk(interaction.user.id);

        // Check if the user has not started the game yet.
        if (userDetail == null) {
            await interaction.editReply({
                content:
                    "You have to first start a project using the /project start command!",
            });
            return;
        }

        // Loop through the ingredients.
        for (const item in ingredients) {
            if (ingredients[item]["id"] == itemid) {
                // Get the name of the ingredient.
                const itemName = ingredients[item]["name"];

                // Check if the user has enough money.
                if (userDetail["coins"] < ingredients[item]["coins"]) {
                    await interaction.editReply({
                        content:
                            "You do not have enough coins to buy this item!",
                    });
                    return;
                }

                // Update the coins in the user's inventory.
                const updatedCoins =
                    userDetail["coins"] - ingredients[item]["coins"];

                // Get the inventory items of the user.
                const userItems = userDetail["inventoryItems"];

                // Check if the user already has the item.
                if (userItems.includes(itemName)) {
                    await interaction.editReply({
                        content:
                            "You already have this item! Why waste your coins?",
                    });
                    return;
                }

                // Add the item to the user's inventory.
                const updatedUserItems = userItems.concat(itemName);

                // Update the user's details.
                await UserDetails.update(
                    {
                        coins: updatedCoins,
                        inventoryItems: updatedUserItems,
                    },
                    {
                        where: {
                            userId: interaction.user.id,
                        },
                    }
                );

                const boughtItem = ingredients[item]["name"];
                const boughtForCoins = ingredients[item]["coins"];

                const embed = new MessageEmbed()
                    .setTitle("Bought an Item")
                    .setDescription(
                        `You bought the item ${boughtItem} for ${boughtForCoins} coins`
                    )
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

                // Send the reply.
                await interaction.editReply({
                    embeds: [embed],
                });
                return;
            }
        }
    },
};
