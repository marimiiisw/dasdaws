const {SlashCommandBuilder} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong! yazarak cevap verir'),

    async excute(interaction)
    {
        await interaction.reply({content: 'Pong!'});
    }
}