const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

// Help command.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("The help command."),
    async execute(interaction) {
        // Create the embed for sending the help command to the user.
        const embed = new MessageEmbed()
            .setTitle("Help")
            .setDescription(
                // Map all the commands with the command name and the description.
                interaction.client.commands
                    .map(
                        (cmd) =>
                            `\`${cmd.data.name}\` - ${cmd.data.description}`
                    )
                    .join("\n")
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

        // Reply the help to the interaction.
        await interaction.reply({ embeds: [embed] });
    },
};
