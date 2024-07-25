const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Bir üyeyi at')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('üye')
                .setDescription('Atılacak üyeyi seç')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Atılma nedeni')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('üye');
            const reason = interaction.options.getString('sebep') || 'Neden belirtilmedi';
            
            // Hata ayıklama için eklemeler
            if (!user) {
                console.error("User is null");
                return await interaction.reply({ content: "Bir üye seçmeniz gerekiyor.", ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(user.id);

            if (!member.kickable) {
                const errembed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${user.username} kullanıcısını atamazsın`);

                return await interaction.reply({ embeds: [errembed] });
            }

            await member.kick(reason);
            const embed = new EmbedBuilder()
                .setColor('Green')
                .addFields(
                    {name:'Atılan Kişi',value:`${user}`, inline: true},
                    {name: 'Neden', value: `${reason}`, inline: true}
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            const errembed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`Bir hata oluştu: ${e.message}`);

            await interaction.reply({ embeds: [errembed] });
        }
    }
};