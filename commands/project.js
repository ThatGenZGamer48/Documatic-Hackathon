const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const data = require("../data.json");
const UserDetails = require("../models/UserDetails");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("project")
        .setDescription("Commands to manage projects")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("start")
                .setDescription("Start a new vaccine project.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("list")
                .setDescription("Lists all the current projects of the user.")
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "start") {
            await interaction.deferReply();

            let viruses = [];

            for (const [key, value] of Object.entries(data["viruses"])) {
                viruses.push(key);
            }

            const randomVirus =
                viruses[Math.floor(Math.random() * viruses.length)];

            const foundResult = await UserDetails.findByPk(interaction.user.id);

            const currentUTCDate = new Date();

            const twentyMinutesBefore = new Date(
                currentUTCDate.getUTCFullYear(),
                currentUTCDate.getUTCMonth(),
                currentUTCDate.getUTCDate(),
                currentUTCDate.getUTCHours(),
                currentUTCDate.getUTCMinutes() - 21,
                currentUTCDate.getUTCSeconds()
            );

            if (foundResult == null) {
                const createUser = await UserDetails.create({
                    userId: interaction.user.id,
                    inventoryItems: ["Default"],
                    coins: BigInt(1000),
                    latestRedeemedTime: twentyMinutesBefore,
                });

                const createdUserInventory =
                    createUser["inventoryItems"].concat(randomVirus);

                await UserDetails.update(
                    { inventoryItems: createdUserInventory },
                    {
                        where: {
                            userId: interaction.user.id,
                        },
                    }
                );

                await createUser.save();
            } else {
                for (const virus of viruses) {
                    if (
                        foundResult["inventoryItems"].includes("SARS-CoV-2") ||
                        foundResult["inventoryItems"].includes("Adenovirus")
                    ) {
                        return interaction.editReply({
                            content:
                                "You are already working on a project! You cannot work on multiple projects at the same time!",
                        });
                    }
                }

                newInventory =
                    foundResult["inventoryItems"].concat(randomVirus);

                await UserDetails.update(
                    { inventoryItems: newInventory },
                    {
                        where: {
                            userId: interaction.user.id,
                        },
                    }
                );

                await foundResult.save();
            }

            const embed = new MessageEmbed()
                .setTitle(
                    "You have been assigned a random virus and 1000 coins..."
                )
                .setDescription(
                    `You have been assigned the virus, \`${randomVirus}\`. Use the tutorial command if you are new and do not know how to play or continue by checking your inventory.`
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

            await interaction.editReply({ embeds: [embed] });
        } else {
            return;
        }
    },
};
