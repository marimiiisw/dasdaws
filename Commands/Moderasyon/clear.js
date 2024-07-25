const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription('İstediğin kadar mesaj sil.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName("sayı")
                .setDescription("Silmek istediğin mesaj sayısı")
                .setMinValue(1)
                .setMaxValue(300)
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, channel } = interaction;
        const amount = options.getInteger("sayı");

        if (!amount) {
            return await interaction.reply({ content: 'Silinecek mesaj sayısını giriniz.', ephemeral: true });
        }

        if (amount > 300 || amount < 1) {
            return await interaction.reply({ content: 'Silinecek mesaj sayısı 1-300 arası olmalıdır.', ephemeral: true });
        }

        try {
            await channel.bulkDelete(amount);
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setDescription(`✅ **${amount}** mesaj silindi.`);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Mesajları silerken bir hata oluştu.', ephemeral: true });
        }
    }
};