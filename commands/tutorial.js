const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tutorial")
        .setDescription("The tutorial on how you can play the game!"),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle("Tutorial")
            .setDescription(
                "[How to play the game](https://gist.github.com/ThatGenZGamer48/be7ac8e88b4afc22d9fda64a5560ec4c)"
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

        await interaction.reply({ embeds: [embed] });
    },
};
