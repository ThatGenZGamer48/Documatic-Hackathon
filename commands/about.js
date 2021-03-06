const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

// About command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("About the bot."),
    async execute(interaction) {
        // Create the embed for sending about the bot.
        const embed = new MessageEmbed()
            .setTitle("About the bot")
            .setDescription(
                "This bot was made for the hackathon hosted by the Documatic team. It focuses on a minigame regarding the development and researching of vaccines."
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

        // Reply with the embed to the interaction.
        await interaction.reply({ embeds: [embed] });
    },
};
