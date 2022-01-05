const { Client, Intents, Collection, Message } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { config } = require("dotenv");
const { readdirSync } = require("fs");
const pool = require("./pgpool.js");

// Configuring everything.
console.clear();

config();

token = process.env.BOT_TOKEN;

// Setting up the client.
const botClient = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
    allowedMentions: { "parse": ["users", "roles"], repliedUser: false },
});

// Registering the slash commands.
botClient.commands = new Collection();

const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = "927180061818359838";
const guildId = "853617621547352104";

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    botClient.commands.set(command.data.name, command);
}

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Registered the slash commands!"))
    .catch(console.error);


// Events.
botClient.on("ready", () => {
    console.log("Bot is ready!");

    pool.connect((err, client, release) => {
        client.query(`create table if not exists inventory(
            id text primary key,
            inventory_items text ARRAY)`, (err, result) => {
            release(err);
        });
    });
});

botClient.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type != "GUILD_TEXT") return;
});

botClient.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = botClient.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        return interaction.reply({
            content: `An unexpected error occured.\n\`\`\`${error}\`\`\``, 
            ephemeral: true, 
        });
    }
});

botClient.login(token);
