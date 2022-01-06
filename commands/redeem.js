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

        const latestRedeemedTime = interactionUserDetails["latestRedeemedTime"];

        const currentUTCDate = new Date();

        const getTimeDifference = (dt2, dt1) => {
            let timeDifference = (dt2.getTime() - dt1.getTime()) / 1000;
            timeDifference /= 60;

            return Math.abs(Math.round(timeDifference));
        };

        timeBetween = getTimeDifference(currentUTCDate, latestRedeemedTime);

        randomCoins = Math.floor(Math.random() * (1000 - 100) + 100);

        const getRandomCoins = () => {
            return Math.floor(Math.random() * (1000 - 100) + 100);
        };

        if (timeBetween >= 20) {
            randomCoins = getRandomCoins();

            const currentCoins = interactionUserDetails["coins"];

            const addedCoins = currentCoins + BigInt(randomCoins);

            const updated = await UserDetails.update(
                { coins: addedCoins, latestRedeemedTime: currentUTCDate },
                {
                    where: {
                        userId: interaction.user.id,
                    },
                }
            );

            await interaction.reply({
                content: `Added ${randomCoins} to your balance!`,
            });
        } else {
            return interaction.reply({
                content:
                    "You cannot redeem now. It has not yet been 20 minutes since you redeemed last.",
            });
        }
    },
};
