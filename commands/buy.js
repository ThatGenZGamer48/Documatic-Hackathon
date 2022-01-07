const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");
const data = require("../data.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")   
        .setDescription("Buy an item in the shop")
        .addIntegerOption(option =>
            option.setName("itemId")
                .setDescription("The ID of the item to buy")
                .setRequired(true)    
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const itemId = interaction.options.getInteger("itemId");
        const ingredients = data["shop"]["ingredients"];

        const ingredientIds = ["1", "2", "3", "4", "5", "6"];

        if (!ingredientIds.includes(itemId)) {
            await interaction.editReply({ content: "Invalid item ID" });
            return;
        }

        const userDetail = await UserDetails.findByPk(interaction.user.id);

        if (userDetail == null) {
            await interaction.editReply({ content: "You have to first start a project using the /project start command!" });
            return;
        }

        for (const item of ingredients) {
            if (item["id"] == itemId) {
                const userDetail = await UserDetails.findByPk(interaction.user.id);

                const itemName = item["name"];

                if (userDetail["coins"] < item["coins"]) {
                    await interaction.editReply({
                        content: "You do not have enough coins to buy this item!"
                    });
                    return;
                }

                const updatedCoins = userDetail["coins"] - item["coins"];

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
                    content: `You bought the item ${item["name"]} for ${item["coins"]} coins`
                });
                return;
            }
        }
    },
};