const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Guild } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir üyeyi yasaklar')
        .addUserOption(option =>
            option.setName('üye')
                .setDescription('Banlanacak üye')
                .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('sebep')
                    .setDescription('Banlanma nedeni')
                    .setRequired(false)
            ),

    async execute(interaction) {
        const { options, channel } = interaction;
        const user = options.getUser('üye');
        const reason = options.getString('sebep') || 'Neden belirtilmedi';

        const member = await interaction.guild.members.fetch(user.id);

        try {
            await member.ban({ reason });
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${user} banlandı. Banlanma nedeni: ${reason}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            const errembed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${user.username} kullanıcısını banlayamazsın`);

            await interaction.reply({ embeds: [errembed] });
        }
    }
};