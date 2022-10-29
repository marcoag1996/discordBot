const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = { 
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exists the current song."),
    execute: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("There is no song playing.");
            return;
        }

        queue.destroy();

        await interaction.reply("Why you bully me?")
    }

}