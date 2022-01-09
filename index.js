/*
Directions of Use:

1. Change the name of the file .env.example to .env and change the variables name according to your Bot & PostgreSQL details.
2. Open pgAdmin 4 and create a new table in the database inputted in the .env file (Table Name: UserDetails). Then create 6 columns with the corresponding names and datatypes. It has been written in the format name: datatype
userId: text
inventoryItems: text[]
coins: bigint
latestRedeemedTime: timestamp without time zone
createdAt: date
updatedAt: date

Note: The SQL standard requires that writing just timestamp be equivalent to timestamp without time zone, and PostgreSQL honors that behavior.

This is because the sequelize auto sync does not work and it fails the redeem command.

You're good to go!
*/

const { Client, Intents, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { config } = require("dotenv");
const { readdirSync } = require("fs");
const pg = require("pg");

// Configuring the date.
pg.types.setTypeParser(1114, (str) => new Date(str.split(" ").join("T") + "Z"));

// Configuring everything.
console.clear();

config();

token = process.env.BOT_TOKEN;

// Setting up the client.
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
    allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

// Registering the slash commands.
client.commands = new Collection();

const commands = [];
const commandFiles = readdirSync("./commands").filter((file) =>
    file.endsWith(".js")
);

const clientId = "927180061818359838";
const guildId = "853617621547352104";

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Registered the slash commands!"))
    .catch(console.error);

// Events.
client.on("ready", () => {
    console.log("Bot is ready!");
});

// Interaction create event.
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {
        await client.commands.get(commandName).execute(interaction);
    } catch (error) {
        console.log(error);
    }
});

// Running the bot.
client.login(token);
