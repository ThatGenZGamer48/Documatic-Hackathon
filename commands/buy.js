const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const shopData = require("../data.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")   
        .setDescription("Buy an item in the shop")
        .addIntegerOption((option) =>
            option.setName("itemid")
                .setDescription("The ID of the item to buy")
                .setRequired(true)    
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const itemid = interaction.options.getInteger("itemid");
        const ingredients = shopData["shop"]["ingredients"];

        const ingredientIds = [1, 2, 3, 4, 5, 6];

        if (!ingredientIds.includes(itemid)) {
            await interaction.editReply({ content: "Invalid item ID" });
            return;
        }

        const userDetail = await UserDetails.findByPk(interaction.user.id);

        if (userDetail == null) {
            await interaction.editReply({ content: "You have to first start a project using the /project start command!" });
            return;
        }

        for (const item in ingredients) {
            if (ingredients[item]["id"] == itemid) {
                const userDetail = await UserDetails.findByPk(interaction.user.id);

                const itemName = ingredients[item]["name"];

                if (userDetail["coins"] < ingredients[item]["coins"]) {
                    await interaction.editReply({
                        content: "You do not have enough coins to buy this item!"
                    });
                    return;
                }

                const updatedCoins = userDetail["coins"] - ingredients[item]["coins"];

                const userItems = userDetail["inventoryItems"];

                if (userItems.includes(itemName)) {
                    await interaction.editReply({
                        content: "You already have this item! Why waste your coins?"
                    });
                    return;
                }

                const updatedUserItems = userItems.concat(itemName);

                await UserDetails.update(
                    {
                        coins: updatedCoins,
                        inventoryItems: updatedUserItems,
                    },
                    {
                        where: {
                            userId: interaction.user.id,
                        }
                    }
                )

                await interaction.editReply({
                    content: `You bought the item ${ingredients[item]["name"]} for ${ingredients[item]["coins"]} coins`
                });
                return;
            }
        }
    },
};