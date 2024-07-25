const {SlashCommandBuilder, EmbedBuilder, Embed} = require('discord.js');
const { data, execute } = require('../Moderasyon/slowmode');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Botun çalışma süresini gösterir'),

    async execute(interaction, Client)
    {
        const days = Math.floor(Client.uptime/ 86400000);
        const hours = Math.floor(Client.uptime/ 3600000) % 24;
        const minutes = Math.floor(Client.uptime/ 60000) %60;
        const seconds = Math.floor(Client.uptime/ 100) %60;

        const embed = new EmbedBuilder()
        .setTitle(`__${Client.user.username} çalışma süresi__`)
        .setColor('Blue')
        .setTimestamp()
        .addFields(
            {name: 'Çalışma Süresi',value: `\`${days}\` gün, \`${hours}\` saat, \`${minutes}\` dakika, \`${seconds}\` saniye.`}
        )
        
        interaction.reply({embeds: [embed]});
    }
}