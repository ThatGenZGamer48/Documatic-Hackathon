const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const data = require("../data.json");
const UserDetails = require("../models/UserDetails");

// Project command. To start a project.

module.exports = {
    data: new SlashCommandBuilder()
        .setName("project")
        .setDescription("Commands to manage projects")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("start")
                .setDescription("Start a new vaccine project.")
        ),
    async execute(interaction) {
        // Get the sub command.
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "start") {

            // Defer reply as it will take some time to communicate to the database.
            await interaction.deferReply();

            // Get the list of viruses.
            let viruses = [];

            for (const key of data["list_of_viruses"]) {
                viruses.push(key);
            }

            // Find the user with the id.
            const foundResult = await UserDetails.findByPk(interaction.user.id);

            // Get the date twenty minutes before so that the user can redeem immediately instead of waiting for 20 minutes for the first time.
            const currentUTCDate = new Date();

            const twentyMinutesBefore = Date.UTC(
                currentUTCDate.getUTCFullYear(),
                currentUTCDate.getUTCMonth(),
                currentUTCDate.getUTCDate(),
                currentUTCDate.getUTCHours(),
                currentUTCDate.getUTCMinutes() - 21,
                currentUTCDate.getUTCSeconds()
            )

            const finalUTCDate = new Date(twentyMinutesBefore);

            if (foundResult == null) {
                // If the user is null, then create a new user. 
                const createdUser = await UserDetails.create({
                    userId: interaction.user.id,
                    inventoryItems: ["Default"],
                    coins: BigInt(1000),
                    latestRedeemedTime: finalUTCDate,
                });

                // Get a random virus
                const randomVirus =
                    viruses[Math.floor(Math.random() * viruses.length)];

                // Add the random virus to the user's inventory.
                const createdUserInventory =
                    createdUser["inventoryItems"].concat(randomVirus);

                // Update the user's inventory in the database.
                await UserDetails.update(
                    { inventoryItems: createdUserInventory },
                    {
                        where: {
                            userId: interaction.user.id,
                        },
                    }
                );

                await createdUser.save();

                // Send the reply message.
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
                // If the user already exists, check if he already is working on a project. If he is not, then start the project.
                if (
                    foundResult["inventoryItems"].includes("SARS-CoV-2") ||
                    foundResult["inventoryItems"].includes("Influenza") ||
                    foundResult["inventoryItems"].includes("Variola")
                ) {
                    return interaction.editReply({
                        content:
                            "You are already working on a project! You cannot work on multiple projects at the same time!",
                    });
                }

                for (const virusOfVaccine in data["virus_of_vaccine"]) {
                    const theVirusOfVaccine = data["virus_of_vaccine"][virusOfVaccine];
                    const vaccineItself = virusOfVaccine;
    
                    if (foundResult["inventoryItems"].includes(vaccineItself)) {
                        const indexOfVirus = viruses.indexOf(theVirusOfVaccine);

                        if (indexOfVirus > -1) {
                            viruses.splice(indexOfVirus, 1);
                        }
                    }
                }

                if (viruses.length == 0) {
                    await interaction.editReply({
                        content: "You already have all the three vaccines! Please use the /gettoken command to get your \"Vaccine Crafter Token\""
                    });
                    return;
                }

                // Get a random virus
                const randomVirus =
                    viruses[Math.floor(Math.random() * viruses.length)];

                // Add the virus to the user's inventory.
                newInventory =
                    foundResult["inventoryItems"].concat(randomVirus);
                // Update the user's inventory with the added virus.
                await UserDetails.update(
                    { inventoryItems: newInventory },
                    {
                        where: {
                            userId: interaction.user.id,
                        },
                    }
                );
                // Save the updated inventory.
                await foundResult.save();

                // Send the reply message.
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
            }
        } else {
            return;
        }
    },
};
