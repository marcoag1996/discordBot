require("dotenv").config();

const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
//const { Routes, ApplicationCommandOptionType } = require("discord.js");
const {Client, GatewayIntentBits, Collection} = require("discord.js");
const {Player} = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");


//const { Client, GatewayIntentBits, Partials } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

/*REPRODUCIR MUSICA */

const commands = []

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    }
});

client.once("ready", () => {
    console.log('Bot is online!');
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
    for(const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
            body: commands
        })
        .then(() => console.log(`Added commands to ${guildId}`))
        .catch(console.error);
    }
})

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) {
        console.log("Not music command");
        return;
    }
    try
    {
        await command.execute({client, interaction});
    }
    catch(err)
    {
        console.error(err);
        await interaction.reply("An error occurred while executing that command.");
    }
});


/*READ MESSAGES*/

const prefix = '-';

/*
client.once('ready', () => {
    console.log('Bot is online!');
});
*/

client.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) {
        console.log("doing nothing");
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if(command === 'julio' || command === 'alejo') {
        message.channel.send('Le gustan los hombres!');
        console.log('sending message');
    }
});



client.login(process.env.TOKEN);
