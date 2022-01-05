const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const data = require("../data.json");
const pool = require("../pgpool.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("project")
		.setDescription("Commands to manage projects")
		.addSubcommand(subcommand =>
			subcommand
				.setName("start")
				.setDescription("Start a new vaccine project."))
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Lists all the current projects of the user.")),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand == "start") {
			await interaction.deferReply();



			let viruses = [];

			for (const [key, value] of Object.entries(data["viruses"])) {
				viruses.push(key);
			}

			const randomVirus = viruses[Math.floor(Math.random() * viruses.length)]

			console.log(typeof interaction.user.id);

			pool.connect((err, client, release) => {
				client.query(`SELECT * from inventory WHERE id = ${interaction.user.id}`, (err, result) => {
					if (result == null || result == undefined) {
						client.query(`INSERT INTO inventory
    									(id, inventory_items)
									VALUES
    									(${interaction.user.id}, ARRAY ["Default"])
    								ON DUPLICATE KEY UPDATE inventory_items = ARRAY ["Default"];`, (err, result) => {
							console.log(err ? err.stack : "Created user");
						});
					} else if (result.rows[0]) {
						console.log(err ? err.stack : result.rows[0].inventory_items);
					}
				});
			});

			pool.connect((err, client, release) => {
				
			});

			const embed = new MessageEmbed()
				.setTitle("You have been assigned a random virus...")
				.setDescription(`You have been assigned the virus, \`${randomVirus}\`. Use the tutorial command if you are new and do not know how to play or continue by checking your inventory.`)
				.setColor("BLUE")
				.setAuthor({
					name: interaction.user.tag, 
					iconURL: interaction.user.avatarURL({ dynamic: true })
				})
				.setFooter({
					text: interaction.client.user.tag, 
					iconURL: interaction.client.user.avatarURL()
				})
				.setTimestamp();

			await interaction.editReply({ embeds: [embed] });
		} else {

		}
	}
}