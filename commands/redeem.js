const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const UserDetails = require("../models/UserDetails");

// Redeem command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("redeem")
        .setDescription("Redeem a random number of coins"),
    async execute(interaction) {
        // Deffering the reply as it may take some time to communicate to the database.
        await interaction.deferReply();
        // Finding the user row in the database.
        const interactionUserDetails = await UserDetails.findByPk(
            interaction.user.id
        );

        if (!interactionUserDetails) {
            // Send this if the user does not exist in the database. (Hasn't started a project.)
            await interaction.editReply({ content: "You have to first start a project using the /project start command!" });
        } else {
            // Get the latest redeemed time
            const latestRedeemedTime = interactionUserDetails["latestRedeemedTime"];

            // Get the current time.
            const currentUTCDate = new Date();

            const getTimeDifference = (dt2, dt1) => {
                let timeDifference = (dt2.getTime() - dt1.getTime()) / 1000;
                timeDifference /= 60;

                return Math.abs(Math.round(timeDifference));
            };


            // Get the time difference (in minutes) using the function.
            const timeBetween = getTimeDifference(currentUTCDate, latestRedeemedTime);

            const getRandomCoins = () => {
                return Math.floor(Math.random() * (1000 - 100) + 100);
            };

            if (timeBetween >= 20) {
                // Get random coins and add it to the current coins.
                const randomCoins = getRandomCoins();

                const currentCoins = interactionUserDetails["coins"];

                const addedCoins = BigInt(currentCoins) + BigInt(randomCoins);

                // Update the time and coins in the database.
                const updated = await UserDetails.update(
                    { coins: addedCoins, latestRedeemedTime: currentUTCDate },
                    {
                        where: {
                            userId: interaction.user.id,
                        },
                    }
                );
                // Reply.
                await interaction.editReply({
                    content: `Added ${randomCoins} to your balance!`,
                });
            } else {
                // Notify user that he can't redeem if it has not been 20 minutes yet.
                return interaction.editReply({
                    content:
                        "You cannot redeem now. It has not yet been 20 minutes since you redeemed last.",
                });
            }

        }
    },
};
